// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Host from '../host/host.js';
import { WebVitalsEventLane, WebVitalsTimeboxLane } from './WebVitalsLane.js';
export const LINE_HEIGHT = 24;
const NUMBER_OF_LANES = 5;
const FCP_GOOD_TIMING = 2000;
const FCP_MEDIUM_TIMING = 4000;
const LCP_GOOD_TIMING = 2500;
const LCP_MEDIUM_TIMING = 4000;
//  eslint-disable-next-line
export function assertInstanceOf(instance, constructor) {
    if (!(instance instanceof constructor)) {
        throw new TypeError(`Instance expected to be of type ${constructor.name} but got ${instance.constructor.name}`);
    }
}
export class WebVitalsTimeline extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.mainFrameNavigations = [];
        this.startTime = 0;
        this.duration = 1000;
        this.maxDuration = 1000;
        this.width = 0;
        this.height = 0;
        this.hoverLane = null;
        this.animationFrame = null;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = `${Math.max(LINE_HEIGHT * NUMBER_OF_LANES, 120)}px`;
        this.shadow.appendChild(this.canvas);
        this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.canvas.addEventListener('pointerout', this.handlePointerOut.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        const context = this.canvas.getContext('2d');
        assertInstanceOf(context, CanvasRenderingContext2D);
        this.context = context;
        this.fcpLane = new WebVitalsEventLane(this, 'FCP', e => this.getMarkerTypeForFCPEvent(e));
        this.lcpLane = new WebVitalsEventLane(this, 'LCP', e => this.getMarkerTypeForLCPEvent(e));
        this.layoutShiftsLane = new WebVitalsEventLane(this, 'LS', _ => "Bad" /* Bad */);
        this.longTasksLane = new WebVitalsTimeboxLane(this, 'Long Tasks');
    }
    set data(data) {
        this.startTime = data.startTime || this.startTime;
        this.duration = data.duration || this.duration;
        this.maxDuration = data.maxDuration || this.maxDuration;
        this.mainFrameNavigations = data.mainFrameNavigations || this.mainFrameNavigations;
        if (data.fcps) {
            this.fcpLane.setEvents(data.fcps);
        }
        if (data.lcps) {
            this.lcpLane.setEvents(data.lcps);
        }
        if (data.layoutShifts) {
            this.layoutShiftsLane.setEvents(data.layoutShifts);
        }
        if (data.longTasks) {
            this.longTasksLane.setTimeboxes(data.longTasks);
        }
        this.scheduleRender();
    }
    getContext() {
        return this.context;
    }
    getLineHeight() {
        return LINE_HEIGHT;
    }
    handlePointerMove(e) {
        const x = e.offsetX, y = e.offsetY;
        const lane = Math.floor(y / LINE_HEIGHT);
        this.hoverLane = lane;
        this.fcpLane.handlePointerMove(this.hoverLane === 1 ? x : null);
        this.lcpLane.handlePointerMove(this.hoverLane === 2 ? x : null);
        this.layoutShiftsLane.handlePointerMove(this.hoverLane === 3 ? x : null);
        this.longTasksLane.handlePointerMove(this.hoverLane === 4 ? x : null);
        this.scheduleRender();
    }
    handlePointerOut(_) {
        this.fcpLane.handlePointerMove(null);
        this.lcpLane.handlePointerMove(null);
        this.layoutShiftsLane.handlePointerMove(null);
        this.longTasksLane.handlePointerMove(null);
        this.scheduleRender();
    }
    handleClick(e) {
        const x = e.offsetX;
        this.focus();
        this.fcpLane.handleClick(this.hoverLane === 1 ? x : null);
        this.lcpLane.handleClick(this.hoverLane === 2 ? x : null);
        this.layoutShiftsLane.handleClick(this.hoverLane === 3 ? x : null);
        this.longTasksLane.handleClick(this.hoverLane === 4 ? x : null);
        this.scheduleRender();
    }
    /**
     * Transform from time to pixel offset
     * @param x
     */
    tX(x) {
        return (x - this.startTime) / this.duration * this.width;
    }
    /**
     * Transform from duration to pixels
     * @param duration
     */
    tD(duration) {
        return duration / this.duration * this.width;
    }
    setSize(width, height) {
        const scale = window.devicePixelRatio;
        this.width = width;
        this.height = Math.max(height, 120);
        this.canvas.width = Math.floor(this.width * scale);
        this.canvas.height = Math.floor(this.height * scale);
        this.context.scale(scale, scale);
        this.style.width = this.width + 'px';
        this.style.height = this.height + 'px';
        this.render();
    }
    connectedCallback() {
        this.style.display = 'block';
        this.tabIndex = 0;
        const boundingClientRect = this.canvas.getBoundingClientRect();
        const width = boundingClientRect.width;
        const height = boundingClientRect.height;
        this.setSize(width, height);
        this.render();
    }
    getMarkerTypeForFCPEvent(event) {
        const t = this.getTimeSinceLastMainFrameNavigation(event.timestamp);
        if (t <= FCP_GOOD_TIMING) {
            return "Good" /* Good */;
        }
        if (t <= FCP_MEDIUM_TIMING) {
            return "Medium" /* Medium */;
        }
        return "Bad" /* Bad */;
    }
    getMarkerTypeForLCPEvent(event) {
        const t = this.getTimeSinceLastMainFrameNavigation(event.timestamp);
        if (t <= LCP_GOOD_TIMING) {
            return "Good" /* Good */;
        }
        if (t <= LCP_MEDIUM_TIMING) {
            return "Medium" /* Medium */;
        }
        return "Bad" /* Bad */;
    }
    renderMainFrameNavigations(markers) {
        this.context.save();
        this.context.strokeStyle = 'blue';
        this.context.beginPath();
        for (const marker of markers) {
            this.context.moveTo(this.tX(marker), 0);
            this.context.lineTo(this.tX(marker), this.height);
        }
        this.context.stroke();
        this.context.restore();
    }
    getTimeSinceLastMainFrameNavigation(time) {
        let i = 0, prev = 0;
        while (i < this.mainFrameNavigations.length && this.mainFrameNavigations[i] <= time) {
            prev = this.mainFrameNavigations[i];
            i++;
        }
        return time - prev;
    }
    render() {
        this.context.save();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.strokeStyle = '#dadce0';
        // Render the grid in the background.
        this.context.beginPath();
        for (let i = 0; i < NUMBER_OF_LANES; i++) {
            this.context.moveTo(0, (i * LINE_HEIGHT) + 0.5);
            this.context.lineTo(this.width, (i * LINE_HEIGHT) + 0.5);
        }
        this.context.moveTo(0, NUMBER_OF_LANES * LINE_HEIGHT - 0.5);
        this.context.lineTo(this.width, NUMBER_OF_LANES * LINE_HEIGHT - 0.5);
        this.context.stroke();
        this.context.restore();
        // Render the WebVitals label.
        this.context.save();
        this.context.font = '11px ' + Host.Platform.fontFamily();
        const text = this.context.measureText('Web Vitals');
        const height = text.actualBoundingBoxAscent - text.actualBoundingBoxDescent;
        this.context.fillStyle = '#202124';
        this.context.fillText('Web Vitals', 6, 4 + height);
        this.context.restore();
        // Render all the lanes.
        this.context.save();
        this.context.translate(0, Number(LINE_HEIGHT));
        this.fcpLane.render();
        this.context.translate(0, Number(LINE_HEIGHT));
        this.lcpLane.render();
        this.context.translate(0, Number(LINE_HEIGHT));
        this.layoutShiftsLane.render();
        this.context.translate(0, Number(LINE_HEIGHT));
        this.longTasksLane.render();
        this.context.restore();
        this.renderMainFrameNavigations(this.mainFrameNavigations);
    }
    scheduleRender() {
        if (this.animationFrame) {
            return;
        }
        this.animationFrame = window.requestAnimationFrame(() => {
            this.animationFrame = null;
            this.render();
        });
    }
}
customElements.define('devtools-timeline-webvitals', WebVitalsTimeline);
//# sourceMappingURL=WebVitalsTimeline.js.map