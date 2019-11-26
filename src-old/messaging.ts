type EventsMap<T = any> = {
  [key: string]: Array<(payload: T) => any>;
};

const messageBus: {
  [key: string]: EventEmitter;
} = {};

export interface IEventEmitter<T = any> {
  off: (eventName: string, callback: Function) => void;
  on: (eventName: string, callback: (data: T) => any) => Function;
  emit: (eventName: string, data: T) => void;
}

export class EventEmitter<T = any> implements IEventEmitter {
  private events: EventsMap<T> = {};
  private getEvents(name: string): Array<Function> {
    this.events[name] = this.events[name] || [];
    return this.events[name];
  }

  public off(eventName: string, callback: Function): void {
    const list = this.getEvents(eventName);
    const idx = list.indexOf(callback);
    if (idx >= 0) {
      list.splice(idx, 1);
    }
  }

  public on(eventName: string, callback: (data: T) => any): Function {
    this.getEvents(eventName).push(callback);
    return () => this.off(eventName, callback);
  }

  public emit(eventName: string, payload?: T): void {
    this.getEvents(eventName).forEach(callback => callback(payload));
  }
}

export const channel = <T = any>(channel: string): EventEmitter<T> => {
  messageBus[channel] = messageBus[channel] || new EventEmitter<T>();
  return messageBus[channel];
};
