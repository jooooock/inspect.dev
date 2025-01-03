import { EventEmitter } from 'events';
import _ from 'lodash';

export class TrackedMap<Type> extends EventEmitter {
  private trackedList: Map<String, Type>;

  constructor() {
    super();
    this.trackedList = new Map();
  }

  public get values() {
    return Array.from(this.trackedList.values());
  }

  async updateSet(newList: Type[]) {
    const changeSet = {
      removed: [],
      changed: [],
      added: [],
    };

    const newMap: Map<String, Type> = new Map();

    for (let i = 0, len = newList.length; i < len; i++) {
      const newItem = newList[i];
      let itemId = newItem['id'];

      if (this.trackedList.get(itemId)) {
        let oldItem = this.trackedList.get(itemId);

        if (!_.isEqual(oldItem, newItem)) {
          changeSet.changed.push(newItem);
          this.emit('change', oldItem, newItem);
        }
      } else {
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
