"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackedMap = void 0;
const events_1 = require("events");
const lodash_1 = __importDefault(require("lodash"));
class TrackedMap extends events_1.EventEmitter {
    constructor() {
        super();
        this.trackedList = new Map();
    }
    get values() {
        return Array.from(this.trackedList.values());
    }
    async updateSet(newList) {
        const changeSet = {
            removed: [],
            changed: [],
            added: [],
        };
        const newMap = new Map();
        for (let i = 0, len = newList.length; i < len; i++) {
            const newItem = newList[i];
            let itemId = newItem['id'];
            if (this.trackedList.get(itemId)) {
                let oldItem = this.trackedList.get(itemId);
                if (!lodash_1.default.isEqual(oldItem, newItem)) {
                    changeSet.changed.push(newItem);
                    this.emit('change', oldItem, newItem);
                }
            }
            else {
                changeSet.added.push(newItem);
                this.emit('add', newItem);
            }
            newMap.set(itemId, newItem);
        }
        const currentList = this.trackedList;
        currentList.forEach(item => {
            let itemId = item['id'];
            if (!newMap.get(itemId)) {
                changeSet.removed.push(item);
                this.emit('remove', item);
            }
        });
        this.emit('changeSet', changeSet);
        this.trackedList = newMap;
    }
}
exports.TrackedMap = TrackedMap;
//# sourceMappingURL=trackedMap.js.map