// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Bindings from '../bindings/bindings.js';
import * as Common from '../common/common.js';
import * as Extensions from '../extensions/extensions.js'; // eslint-disable-line no-unused-vars
import * as Platform from '../platform/platform.js';
import * as ProtocolClient from '../protocol_client/protocol_client.js';
import * as Root from '../root/root.js';
import * as SDK from '../sdk/sdk.js';
import * as TimelineModel from '../timeline_model/timeline_model.js';
import { ExtensionTracingSession } from './ExtensionTracingSession.js';
import { PerformanceModel } from './PerformanceModel.js';
/**
 * @implements {SDK.SDKModel.SDKModelObserver<!SDK.CPUProfilerModel.CPUProfilerModel>}
 * @implements {SDK.TracingManager.TracingManagerClient}
 */
export class TimelineController {
    /**
     * @param {!SDK.SDKModel.Target} target
     * @param {!Client} client
     */
    constructor(target, client) {
        this._target = target;
        this._tracingManager = target.model(SDK.TracingManager.TracingManager);
        this._performanceModel = new PerformanceModel();
        this._performanceModel.setMainTarget(target);
        this._client = client;
        const backingStorage = new Bindings.TempFile.TempFileBackingStorage();
        this._tracingModel = new SDK.TracingModel.TracingModel(backingStorage);
        /** @type {!Array<!ExtensionTracingSession>} */
        this._extensionSessions = [];
        SDK.SDKModel.TargetManager.instance().observeModels(SDK.CPUProfilerModel.CPUProfilerModel, this);
    }
    dispose() {
        SDK.SDKModel.TargetManager.instance().unobserveModels(SDK.CPUProfilerModel.CPUProfilerModel, this);
    }
    /**
     * @return {!SDK.SDKModel.Target}
     */
    mainTarget() {
        return this._target;
    }
    /**
     * @param {!RecordingOptions} options
     * @param {!Array<!Extensions.ExtensionTraceProvider.ExtensionTraceProvider>} providers
     * @return {!Promise<!Object>}
     */
    async startRecording(options, providers) {
        this._extensionTraceProviders = Extensions.ExtensionServer.ExtensionServer.instance().traceProviders().slice();
        /**
         * @param {string} category
         * @return {string}
         */
        function disabledByDefault(category) {
            return 'disabled-by-default-' + category;
        }
        const categoriesArray = [
            '-*',
            'devtools.timeline',
            disabledByDefault('devtools.timeline'),
            disabledByDefault('devtools.timeline.frame'),
            'v8.execute',
            TimelineModel.TimelineModel.TimelineModelImpl.Category.Console,
            TimelineModel.TimelineModel.TimelineModelImpl.Category.UserTiming,
            TimelineModel.TimelineModel.TimelineModelImpl.Category.Loading,
        ];
        categoriesArray.push(TimelineModel.TimelineModel.TimelineModelImpl.Category.LatencyInfo);
        if (Root.Runtime.experiments.isEnabled('timelineFlowEvents')) {
            categoriesArray.push('devtools.timeline.async');
        }
        if (Root.Runtime.experiments.isEnabled('timelineV8RuntimeCallStats') && options.enableJSSampling) {
            categoriesArray.push(disabledByDefault('v8.runtime_stats_sampling'));
        }
        if (!Root.Runtime.Runtime.queryParam('timelineTracingJSProfileDisabled') && options.enableJSSampling) {
            categoriesArray.push(disabledByDefault('v8.cpu_profiler'));
        }
        categoriesArray.push(disabledByDefault('devtools.timeline.stack'));
        if (Root.Runtime.experiments.isEnabled('timelineInvalidationTracking')) {
            categoriesArray.push(disabledByDefault('devtools.timeline.invalidationTracking'));
        }
        if (options.capturePictures) {
            categoriesArray.push(disabledByDefault('devtools.timeline.layers'), disabledByDefault('devtools.timeline.picture'), disabledByDefault('blink.graphics_context_annotations'));
        }
        if (options.captureFilmStrip) {
            categoriesArray.push(disabledByDefault('devtools.screenshot'));
        }
        this._extensionSessions = providers.map(provider => new ExtensionTracingSession(provider, this._performanceModel));
        this._extensionSessions.forEach(session => session.start());
        this._performanceModel.setRecordStartTime(Date.now());
        const response = await this._startRecordingWithCategories(categoriesArray.join(','), options.enableJSSampling);
        if (!response) {
            throw new Error('Missing backend response');
        }
        if (ProtocolClient.InspectorBackend.ProtocolError in response) {
            await this._waitForTracingToStop(false);
            await SDK.SDKModel.TargetManager.instance().resumeAllTargets();
        }
        return response;
    }
    /**
     * @return {!Promise<!PerformanceModel>}
     */
    async stopRecording() {
        if (this._tracingManager) {
            this._tracingManager.stop();
        }
        this._client.loadingStarted();
        await this._waitForTracingToStop(true);
        this._allSourcesFinished();
        return this._performanceModel;
    }
    /**
     * @param {boolean} awaitTracingCompleteCallback - Whether to wait for the _tracingCompleteCallback to happen
     * @return {!Promise<void>}
     */
    async _waitForTracingToStop(awaitTracingCompleteCallback) {
        const tracingStoppedPromises = [];
        if (this._tracingManager && awaitTracingCompleteCallback) {
            tracingStoppedPromises.push(new Promise(resolve => {
                this._tracingCompleteCallback = resolve;
            }));
        }
        tracingStoppedPromises.push(this._stopProfilingOnAllModels());
        const extensionCompletionPromises = this._extensionSessions.map(session => session.stop());
        if (extensionCompletionPromises.length) {
            tracingStoppedPromises.push(Promise.race([Promise.all(extensionCompletionPromises), new Promise(r => setTimeout(r, 5000))]));
        }
        await Promise.all(tracingStoppedPromises);
    }
    /**
     * @override
     * @param {!SDK.CPUProfilerModel.CPUProfilerModel} cpuProfilerModel
     */
    modelAdded(cpuProfilerModel) {
        if (this._profiling) {
            cpuProfilerModel.startRecording();
        }
    }
    /**
     * @override
     * @param {!SDK.CPUProfilerModel.CPUProfilerModel} cpuProfilerModel
     */
    modelRemoved(cpuProfilerModel) {
        // FIXME: We'd like to stop profiling on the target and retrieve a profile
        // but it's too late. Backend connection is closed.
    }
    /**
     * @return {!Promise<void>}
     */
    async _startProfilingOnAllModels() {
        this._profiling = true;
        const models = SDK.SDKModel.TargetManager.instance().models(SDK.CPUProfilerModel.CPUProfilerModel);
        await Promise.all(models.map(model => model.startRecording()));
    }
    /**
     * @param {string} targetId
     * @param {?Protocol.Profiler.Profile} cpuProfile
     */
    _addCpuProfile(targetId, cpuProfile) {
        if (!cpuProfile) {
            Common.Console.Console.instance().warn(Common.UIString.UIString('CPU profile for a target is not available.'));
            return;
        }
        if (!this._cpuProfiles) {
            this._cpuProfiles = new Map();
        }
        this._cpuProfiles.set(targetId, cpuProfile);
    }
    /**
     * @return {!Promise<void>}
     */
    async _stopProfilingOnAllModels() {
        const models = this._profiling ? SDK.SDKModel.TargetManager.instance().models(SDK.CPUProfilerModel.CPUProfilerModel) : [];
        this._profiling = false;
        const promises = [];
        for (const model of models) {
            const targetId = model.target().id();
            const modelPromise = model.stopRecording().then(this._addCpuProfile.bind(this, targetId));
            promises.push(modelPromise);
        }
        await Promise.all(promises);
    }
    /**
     * @param {string} categories
     * @param {boolean=} enableJSSampling
     * @return {!Promise<!Object|undefined>}
     */
    async _startRecordingWithCategories(categories, enableJSSampling) {
        // There might be a significant delay in the beginning of timeline recording
        // caused by starting CPU profiler, that needs to traverse JS heap to collect
        // all the functions data.
        await SDK.SDKModel.TargetManager.instance().suspendAllTargets('performance-timeline');
        if (enableJSSampling && Root.Runtime.Runtime.queryParam('timelineTracingJSProfileDisabled')) {
            await this._startProfilingOnAllModels();
        }
        if (!this._tracingManager) {
            return;
        }
        return this._tracingManager.start(this, categories, '');
    }
    /**
     * @param {!Array.<!SDK.TracingManager.EventPayload>} events
     * @override
     */
    traceEventsCollected(events) {
        this._tracingModel.addEvents(events);
    }
    /**
     * @override
     */
    tracingComplete() {
        if (!this._tracingCompleteCallback) {
            return;
        }
        this._tracingCompleteCallback(undefined);
        this._tracingCompleteCallback = null;
    }
    _allSourcesFinished() {
        this._client.processingStarted();
        setTimeout(() => this._finalizeTrace(), 0);
    }
    /**
     * @return {!Promise<void>}
     */
    async _finalizeTrace() {
        this._injectCpuProfileEvents();
        await SDK.SDKModel.TargetManager.instance().resumeAllTargets();
        this._tracingModel.tracingComplete();
        this._client.loadingComplete(this._tracingModel);
    }
    /**
     * @param {number} pid
     * @param {number} tid
     * @param {?Protocol.Profiler.Profile} cpuProfile
     */
    _injectCpuProfileEvent(pid, tid, cpuProfile) {
        if (!cpuProfile) {
            return;
        }
        // TODO(crbug/1011811): This event type is not compatible with the SDK.TracingManager.EventPayload.
        // EventPayload requires many properties to be defined but it's not clear if they will have
        // any side effects.
        const cpuProfileEvent = /** @type {*} */ ({
            cat: SDK.TracingModel.DevToolsMetadataEventCategory,
            ph: SDK.TracingModel.Phase.Instant,
            ts: this._tracingModel.maximumRecordTime() * 1000,
            pid: pid,
            tid: tid,
            name: TimelineModel.TimelineModel.RecordType.CpuProfile,
            args: { data: { cpuProfile: cpuProfile } }
        });
        this._tracingModel.addEvents([cpuProfileEvent]);
    }
    /**
     * @return {?Map<string, number>}
     */
    _buildTargetToProcessIdMap() {
        const metadataEventTypes = TimelineModel.TimelineModel.TimelineModelImpl.DevToolsMetadataEvent;
        const metadataEvents = this._tracingModel.devToolsMetadataEvents();
        const browserMetaEvent = metadataEvents.find(e => e.name === metadataEventTypes.TracingStartedInBrowser);
        if (!browserMetaEvent) {
            return null;
        }
        /** @type {!Platform.Multimap<string, string>} */
        const pseudoPidToFrames = new Platform.Multimap();
        /** @type {!Map<string, number>} */
        const targetIdToPid = new Map();
        /** @type {!Array<*>} */
        const frames = browserMetaEvent.args.data.frames;
        for (const frameInfo of frames) {
            targetIdToPid.set(frameInfo.frame, frameInfo.processId);
        }
        for (const event of metadataEvents) {
            const data = event.args.data;
            switch (event.name) {
                case metadataEventTypes.FrameCommittedInBrowser:
                    if (data.processId) {
                        targetIdToPid.set(data.frame, data.processId);
                    }
                    else {
                        pseudoPidToFrames.set(data.processPseudoId, data.frame);
                    }
                    break;
                case metadataEventTypes.ProcessReadyInBrowser:
                    for (const frame of pseudoPidToFrames.get(data.processPseudoId) || []) {
                        targetIdToPid.set(frame, data.processId);
                    }
                    break;
            }
        }
        const mainFrame = frames.find(frame => !frame.parent);
        const mainRendererProcessId = mainFrame.processId;
        const mainProcess = this._tracingModel.processById(mainRendererProcessId);
        if (mainProcess) {
            const target = SDK.SDKModel.TargetManager.instance().mainTarget();
            if (target) {
                targetIdToPid.set(target.id(), mainProcess.id());
            }
        }
        return targetIdToPid;
    }
    _injectCpuProfileEvents() {
        if (!this._cpuProfiles) {
            return;
        }
        const metadataEventTypes = TimelineModel.TimelineModel.TimelineModelImpl.DevToolsMetadataEvent;
        const metadataEvents = this._tracingModel.devToolsMetadataEvents();
        const targetIdToPid = this._buildTargetToProcessIdMap();
        if (targetIdToPid) {
            for (const [id, profile] of this._cpuProfiles) {
                const pid = targetIdToPid.get(id);
                if (!pid) {
                    continue;
                }
                const process = this._tracingModel.processById(pid);
                const thread = process && process.threadByName(TimelineModel.TimelineModel.TimelineModelImpl.RendererMainThreadName);
                if (thread) {
                    this._injectCpuProfileEvent(pid, thread.id(), profile);
                }
            }
        }
        else {
            // Legacy backends support.
            const mainMetaEvent = metadataEvents.filter(event => event.name === metadataEventTypes.TracingStartedInPage).peekLast();
            if (mainMetaEvent) {
                const pid = mainMetaEvent.thread.process().id();
                if (this._tracingManager) {
                    const mainCpuProfile = this._cpuProfiles.get(this._tracingManager.target().id());
                    this._injectCpuProfileEvent(pid, mainMetaEvent.thread.id(), mainCpuProfile);
                }
            }
            else {
                // Or there was no tracing manager in the main target at all, in this case build the model full
                // of cpu profiles.
                let tid = 0;
                for (const pair of this._cpuProfiles) {
                    const target = SDK.SDKModel.TargetManager.instance().targetById(pair[0]);
                    const name = target && target.name();
                    this._tracingModel.addEvents(TimelineModel.TimelineJSProfile.TimelineJSProfileProcessor.buildTraceProfileFromCpuProfile(pair[1], ++tid, /* injectPageEvent */ tid === 1, name));
                }
            }
        }
        const workerMetaEvents = metadataEvents.filter(event => event.name === metadataEventTypes.TracingSessionIdForWorker);
        for (const metaEvent of workerMetaEvents) {
            const workerId = metaEvent.args['data']['workerId'];
            const cpuProfile = this._cpuProfiles.get(workerId);
            this._injectCpuProfileEvent(metaEvent.thread.process().id(), metaEvent.args['data']['workerThreadId'], cpuProfile);
        }
        this._cpuProfiles = null;
    }
    /**
     * @param {number} usage
     * @override
     */
    tracingBufferUsage(usage) {
        this._client.recordingProgress(usage);
    }
    /**
     * @param {number} progress
     * @override
     */
    eventsRetrievalProgress(progress) {
        this._client.loadingProgress(progress);
    }
}
/**
 * @interface
 * @extends {TimelineLoaderClient}
 */
export class Client {
    /**
     * @param {number} usage
     */
    recordingProgress(usage) {
    }
    loadingStarted() {
    }
    processingStarted() {
    }
    /**
     * @param {number=} progress
     */
    loadingProgress(progress) {
    }
    /**
     * @param {?SDK.TracingModel.TracingModel} tracingModel
     */
    loadingComplete(tracingModel) {
    }
}
/**
 * @typedef {!{
 *   enableJSSampling: (boolean|undefined),
 *   capturePictures: (boolean|undefined),
 *   captureFilmStrip: (boolean|undefined),
 *   startCoverage: (boolean|undefined)
 * }}
 */
// @ts-ignore typedef
export let RecordingOptions;
//# sourceMappingURL=TimelineController.js.map