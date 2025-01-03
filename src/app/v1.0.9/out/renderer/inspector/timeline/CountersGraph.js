/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as Common from '../common/common.js';
import * as PerfUI from '../perf_ui/perf_ui.js';
import * as Platform from '../platform/platform.js';
import * as TimelineModel from '../timeline_model/timeline_model.js';
import * as UI from '../ui/ui.js';
import { Events } from './PerformanceModel.js'; // eslint-disable-line no-unused-vars
export class CountersGraph extends UI.Widget.VBox {
    /**
     * @param {!TimelineModeViewDelegate} delegate
     */
    constructor(delegate) {
        super();
        this.element.id = 'memory-graphs-container';
        this._delegate = delegate;
        this._calculator = new Calculator();
        /** @type {?PerformanceModel} */
        this._model;
        // Create selectors
        this._header = new UI.Widget.HBox();
        this._header.element.classList.add('timeline-memory-header');
        this._header.show(this.element);
        this._toolbar = new UI.Toolbar.Toolbar('timeline-memory-toolbar');
        this._header.element.appendChild(this._toolbar.element);
        this._graphsContainer = new UI.Widget.VBox();
        this._graphsContainer.show(this.element);
        const canvasWidget = new UI.Widget.VBoxWithResizeCallback(this._resize.bind(this));
        canvasWidget.show(this._graphsContainer.element);
        this._createCurrentValuesBar();
        this._canvasContainer = canvasWidget.element;
        this._canvasContainer.id = 'memory-graphs-canvas-container';
        this._canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
        this._canvasContainer.appendChild(this._canvas);
        this._canvas.id = 'memory-counters-graph';
        this._canvasContainer.addEventListener('mouseover', this._onMouseMove.bind(this), true);
        this._canvasContainer.addEventListener('mousemove', this._onMouseMove.bind(this), true);
        this._canvasContainer.addEventListener('mouseleave', this._onMouseLeave.bind(this), true);
        this._canvasContainer.addEventListener('click', this._onClick.bind(this), true);
        // We create extra timeline grid here to reuse its event dividers.
        this._timelineGrid = new PerfUI.TimelineGrid.TimelineGrid();
        this._canvasContainer.appendChild(this._timelineGrid.dividersElement);
        /** @type {!Array<!Counter>} */
        this._counters = [];
        /** @type {!Array<!CounterUI>} */
        this._counterUI = [];
        /** @type {!Map<string, !Counter>} */
        this._countersByName = new Map();
        this._countersByName.set('jsHeapSizeUsed', this._createCounter(Common.UIString.UIString('JS Heap'), Common.UIString.UIString('JS Heap: %s'), 'hsl(220, 90%, 43%)', Platform.NumberUtilities.bytesToString));
        this._countersByName.set('documents', this._createCounter(Common.UIString.UIString('Documents'), Common.UIString.UIString('Documents: %s'), 'hsl(0, 90%, 43%)'));
        this._countersByName.set('nodes', this._createCounter(Common.UIString.UIString('Nodes'), Common.UIString.UIString('Nodes: %s'), 'hsl(120, 90%, 43%)'));
        this._countersByName.set('jsEventListeners', this._createCounter(Common.UIString.UIString('Listeners'), Common.UIString.UIString('Listeners: %s'), 'hsl(38, 90%, 43%)'));
        this._gpuMemoryCounter = this._createCounter(Common.UIString.UIString('GPU Memory'), Common.UIString.UIString('GPU Memory: %s'), 'hsl(300, 90%, 43%)', Platform.NumberUtilities.bytesToString);
        this._countersByName.set('gpuMemoryUsedKB', this._gpuMemoryCounter);
    }
    /**
     * @param {?PerformanceModel} model
     * @param {?TimelineModel.TimelineModel.Track} track
     */
    setModel(model, track) {
        if (this._model !== model) {
            if (this._model) {
                this._model.removeEventListener(Events.WindowChanged, this._onWindowChanged, this);
            }
            this._model = model;
            if (this._model) {
                this._model.addEventListener(Events.WindowChanged, this._onWindowChanged, this);
            }
        }
        this._calculator.setZeroTime(model ? model.timelineModel().minimumRecordTime() : 0);
        for (let i = 0; i < this._counters.length; ++i) {
            this._counters[i].reset();
            this._counterUI[i].reset();
        }
        this.scheduleRefresh();
        this._track = track;
        if (!track) {
            return;
        }
        const events = track.syncEvents();
        for (let i = 0; i < events.length; ++i) {
            const event = events[i];
            if (event.name !== TimelineModel.TimelineModel.RecordType.UpdateCounters) {
                continue;
            }
            const counters = event.args.data;
            if (!counters) {
                return;
            }
            for (const name in counters) {
                const counter = this._countersByName.get(name);
                if (counter) {
                    counter.appendSample(event.startTime, counters[name]);
                }
            }
            const gpuMemoryLimitCounterName = 'gpuMemoryLimitKB';
            if (gpuMemoryLimitCounterName in counters) {
                this._gpuMemoryCounter.setLimit(counters[gpuMemoryLimitCounterName]);
            }
        }
    }
    _createCurrentValuesBar() {
        this._currentValuesBar = this._graphsContainer.element.createChild('div');
        this._currentValuesBar.id = 'counter-values-bar';
    }
    /**
     * @param {string} uiName
     * @param {string} uiValueTemplate
     * @param {string} color
     * @param {function(number):string=} formatter
     * @return {!Counter}
     */
    _createCounter(uiName, uiValueTemplate, color, formatter) {
        const counter = new Counter();
        this._counters.push(counter);
        this._counterUI.push(new CounterUI(this, uiName, uiValueTemplate, color, counter, formatter));
        return counter;
    }
    /**
     * @return {?Element}
     */
    resizerElement() {
        return this._header.element;
    }
    _resize() {
        const parentElement = /** @type {!HTMLElement} */ (this._canvas.parentElement);
        this._canvas.width = parentElement.clientWidth * window.devicePixelRatio;
        this._canvas.height = parentElement.clientHeight * window.devicePixelRatio;
        this._calculator.setDisplayWidth(this._canvas.width);
        this.refresh();
    }
    /**
     * @param {!Common.EventTarget.EventTargetEvent} event
     */
    _onWindowChanged(event) {
        const window = /** @type {!Window} */ (event.data.window);
        this._calculator.setWindow(window.left, window.right);
        this.scheduleRefresh();
    }
    scheduleRefresh() {
        UI.UIUtils.invokeOnceAfterBatchUpdate(this, this.refresh);
    }
    draw() {
        this._clear();
        for (const counter of this._counters) {
            counter._calculateVisibleIndexes(this._calculator);
            counter._calculateXValues(this._canvas.width);
        }
        for (const counterUI of this._counterUI) {
            counterUI._drawGraph(this._canvas);
        }
    }
    /**
     * @param {!Event} event
     */
    _onClick(event) {
        const x = /** @type {!MouseEvent} */ (event).x - this._canvasContainer.totalOffsetLeft();
        let minDistance = Infinity;
        let bestTime;
        for (const counterUI of this._counterUI) {
            if (!counterUI.counter.times.length) {
                continue;
            }
            const index = counterUI._recordIndexAt(x);
            const distance = Math.abs(x * window.devicePixelRatio - counterUI.counter.x[index]);
            if (distance < minDistance) {
                minDistance = distance;
                bestTime = counterUI.counter.times[index];
            }
        }
        if (bestTime !== undefined && this._track) {
            this._delegate.selectEntryAtTime(this._track.events.length ? this._track.events : this._track.asyncEvents, bestTime);
        }
    }
    /**
     * @param {!Event} event
     */
    _onMouseLeave(event) {
        delete this._markerXPosition;
        this._clearCurrentValueAndMarker();
    }
    _clearCurrentValueAndMarker() {
        for (let i = 0; i < this._counterUI.length; i++) {
            this._counterUI[i]._clearCurrentValueAndMarker();
        }
    }
    /**
     * @param {!Event} event
     */
    _onMouseMove(event) {
        const x = /** @type {!MouseEvent} */ (event).x - this._canvasContainer.totalOffsetLeft();
        this._markerXPosition = x;
        this._refreshCurrentValues();
    }
    _refreshCurrentValues() {
        if (this._markerXPosition === undefined) {
            return;
        }
        for (let i = 0; i < this._counterUI.length; ++i) {
            this._counterUI[i].updateCurrentValue(this._markerXPosition);
        }
    }
    refresh() {
        this._timelineGrid.updateDividers(this._calculator);
        this.draw();
        this._refreshCurrentValues();
    }
    _clear() {
        const ctx = this._canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to get canvas context');
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}
export class Counter {
    constructor() {
        /** @type {!Array<number>} */
        this.times = [];
        /** @type {!Array<number>} */
        this.values = [];
        /** @type {!Array<number>} */
        this.x = [];
        this._minimumIndex = 0;
        this._maximumIndex = 0;
        this._maxTime = 0;
        this._minTime = 0;
    }
    /**
     * @param {number} time
     * @param {number} value
     */
    appendSample(time, value) {
        if (this.values.length && this.values.peekLast() === value) {
            return;
        }
        this.times.push(time);
        this.values.push(value);
    }
    reset() {
        this.times = [];
        this.values = [];
    }
    /**
     * @param {number} value
     */
    setLimit(value) {
        this._limitValue = value;
    }
    /**
     * @return {!{min: number, max: number}}
     */
    _calculateBounds() {
        let maxValue;
        let minValue;
        for (let i = this._minimumIndex; i <= this._maximumIndex; i++) {
            const value = this.values[i];
            if (minValue === undefined || value < minValue) {
                minValue = value;
            }
            if (maxValue === undefined || value > maxValue) {
                maxValue = value;
            }
        }
        minValue = minValue || 0;
        maxValue = maxValue || 1;
        if (this._limitValue) {
            if (maxValue > this._limitValue * 0.5) {
                maxValue = Math.max(maxValue, this._limitValue);
            }
            minValue = Math.min(minValue, this._limitValue);
        }
        return { min: minValue, max: maxValue };
    }
    /**
     * @param {!Calculator} calculator
     */
    _calculateVisibleIndexes(calculator) {
        const start = calculator.minimumBoundary();
        const end = calculator.maximumBoundary();
        // Maximum index of element whose time <= start.
        this._minimumIndex = Platform.NumberUtilities.clamp(this.times.upperBound(start) - 1, 0, this.times.length - 1);
        // Minimum index of element whose time >= end.
        this._maximumIndex = Platform.NumberUtilities.clamp(this.times.lowerBound(end), 0, this.times.length - 1);
        // Current window bounds.
        this._minTime = start;
        this._maxTime = end;
    }
    /**
     * @param {number} width
     */
    _calculateXValues(width) {
        if (!this.values.length) {
            return;
        }
        const xFactor = width / (this._maxTime - this._minTime);
        this.x = new Array(this.values.length);
        for (let i = this._minimumIndex + 1; i <= this._maximumIndex; i++) {
            this.x[i] = xFactor * (this.times[i] - this._minTime);
        }
    }
}
export class CounterUI {
    /**
     * @param {!CountersGraph} countersPane
     * @param {string} title
     * @param {string} currentValueLabel
     * @param {string} graphColor
     * @param {!Counter} counter
     * @param {(function(number): string)|undefined} formatter
     */
    constructor(countersPane, title, currentValueLabel, graphColor, counter, formatter) {
        this._countersPane = countersPane;
        this.counter = counter;
        this._formatter = formatter || Number.withThousandsSeparator;
        this._setting = Common.Settings.Settings.instance().createSetting('timelineCountersGraph-' + title, true);
        this._setting.setTitle(title);
        this._filter = new UI.Toolbar.ToolbarSettingCheckbox(this._setting, title);
        this._filter.inputElement.classList.add('-theme-preserve-input');
        const parsedColor = Common.Color.Color.parse(graphColor);
        if (parsedColor) {
            const colorWithAlpha = parsedColor.setAlpha(0.5).asString(Common.Color.Format.RGBA);
            const htmlElement = /** @type {!HTMLElement} */ (this._filter.element);
            if (colorWithAlpha) {
                htmlElement.style.backgroundColor = colorWithAlpha;
            }
            htmlElement.style.borderColor = 'transparent';
        }
        this._filter.inputElement.addEventListener('click', this._toggleCounterGraph.bind(this));
        countersPane._toolbar.appendToolbarItem(this._filter);
        this._range = this._filter.element.createChild('span', 'range');
        this._value =
            /** @type {!HTMLElement} */ (countersPane._currentValuesBar).createChild('span', 'memory-counter-value');
        this._value.style.color = graphColor;
        this.graphColor = graphColor;
        if (parsedColor) {
            this.limitColor = parsedColor.setAlpha(0.3).asString(Common.Color.Format.RGBA);
        }
        /** @type {!Array<number>} */
        this.graphYValues = [];
        this._verticalPadding = 10;
        this._currentValueLabel = currentValueLabel;
        this._marker = countersPane._canvasContainer.createChild('div', 'memory-counter-marker');
        this._marker.style.backgroundColor = graphColor;
        this._clearCurrentValueAndMarker();
    }
    reset() {
        this._range.textContent = '';
    }
    /**
     * @param {number} minValue
     * @param {number} maxValue
     */
    setRange(minValue, maxValue) {
        const min = this._formatter(minValue);
        const max = this._formatter(maxValue);
        this._range.textContent = Common.UIString.UIString('[%s\xa0\u2013\xa0%s]', min, max);
    }
    _toggleCounterGraph() {
        this._value.classList.toggle('hidden', !this._filter.checked());
        this._countersPane.refresh();
    }
    /**
     * @param {number} x
     * @return {number}
     */
    _recordIndexAt(x) {
        return this.counter.x.upperBound(x * window.devicePixelRatio, undefined, this.counter._minimumIndex + 1, this.counter._maximumIndex + 1) -
            1;
    }
    /**
     * @param {number} x
     */
    updateCurrentValue(x) {
        if (!this.visible() || !this.counter.values.length || !this.counter.x) {
            return;
        }
        const index = this._recordIndexAt(x);
        const value = Number.withThousandsSeparator(this.counter.values[index]);
        this._value.textContent = Common.UIString.UIString(this._currentValueLabel, value);
        const y = this.graphYValues[index] / window.devicePixelRatio;
        this._marker.style.left = x + 'px';
        this._marker.style.top = y + 'px';
        this._marker.classList.remove('hidden');
    }
    _clearCurrentValueAndMarker() {
        this._value.textContent = '';
        this._marker.classList.add('hidden');
    }
    /**
     * @param {!HTMLCanvasElement} canvas
     */
    _drawGraph(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to get canvas context');
        }
        const width = canvas.width;
        const height = canvas.height - 2 * this._verticalPadding;
        if (height <= 0) {
            this.graphYValues = [];
            return;
        }
        const originY = this._verticalPadding;
        const counter = this.counter;
        const values = counter.values;
        if (!values.length) {
            return;
        }
        const bounds = counter._calculateBounds();
        const minValue = bounds.min;
        const maxValue = bounds.max;
        this.setRange(minValue, maxValue);
        if (!this.visible()) {
            return;
        }
        const yValues = this.graphYValues;
        const maxYRange = maxValue - minValue;
        const yFactor = maxYRange ? height / (maxYRange) : 1;
        ctx.save();
        ctx.lineWidth = window.devicePixelRatio;
        if (ctx.lineWidth % 2) {
            ctx.translate(0.5, 0.5);
        }
        ctx.beginPath();
        let value = values[counter._minimumIndex];
        let currentY = Math.round(originY + height - (value - minValue) * yFactor);
        ctx.moveTo(0, currentY);
        let i = counter._minimumIndex;
        for (; i <= counter._maximumIndex; i++) {
            const x = Math.round(counter.x[i]);
            ctx.lineTo(x, currentY);
            const currentValue = values[i];
            if (typeof currentValue !== 'undefined') {
                value = currentValue;
            }
            currentY = Math.round(originY + height - (value - minValue) * yFactor);
            ctx.lineTo(x, currentY);
            yValues[i] = currentY;
        }
        yValues.length = i;
        ctx.lineTo(width, currentY);
        ctx.strokeStyle = this.graphColor;
        ctx.stroke();
        if (counter._limitValue) {
            const limitLineY = Math.round(originY + height - (counter._limitValue - minValue) * yFactor);
            ctx.moveTo(0, limitLineY);
            ctx.lineTo(width, limitLineY);
            if (this.limitColor) {
                ctx.strokeStyle = this.limitColor;
            }
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    /**
     * @return {boolean}
     */
    visible() {
        return this._filter.checked();
    }
}
/**
 * @implements {PerfUI.TimelineGrid.Calculator}
 */
export class Calculator {
    constructor() {
        this._minimumBoundary = 0;
        this._maximumBoundary = 0;
        this._workingArea = 0;
        this._zeroTime = 0;
    }
    /**
     * @param {number} time
     */
    setZeroTime(time) {
        this._zeroTime = time;
    }
    /**
     * @override
     * @param {number} time
     * @return {number}
     */
    computePosition(time) {
        return (time - this._minimumBoundary) / this.boundarySpan() * this._workingArea;
    }
    /**
     *
     * @param {number} minimumBoundary
     * @param {number} maximumBoundary
     */
    setWindow(minimumBoundary, maximumBoundary) {
        this._minimumBoundary = minimumBoundary;
        this._maximumBoundary = maximumBoundary;
    }
    /**
     * @param {number} clientWidth
     */
    setDisplayWidth(clientWidth) {
        this._workingArea = clientWidth;
    }
    /**
     * @override
     * @param {number} value
     * @param {number=} precision
     * @return {string}
     */
    formatValue(value, precision) {
        return Number.preciseMillisToString(value - this.zeroTime(), precision);
    }
    /**
     * @override
     * @return {number}
     */
    maximumBoundary() {
        return this._maximumBoundary;
    }
    /**
     * @override
     * @return {number}
     */
    minimumBoundary() {
        return this._minimumBoundary;
    }
    /**
     * @override
     * @return {number}
     */
    zeroTime() {
        return this._zeroTime;
    }
    /**
     * @override
     * @return {number}
     */
    boundarySpan() {
        return this._maximumBoundary - this._minimumBoundary;
    }
}
//# sourceMappingURL=CountersGraph.js.map