import { IDispatcher, Callback, Unsubsciber } from "./interfaces.js";

export class Dispatcher<T = any> implements IDispatcher<T> {

    private callbacks = new Set<Callback<T>>();

    public subscribe(callback: Callback<T>): Unsubsciber {
        this.callbacks.add(callback);
        return () => this.unsubscribe(callback);
    }

    public unsubscribe(callback: Callback<T>): void {
        this.callbacks.delete(callback);
    }

    public notify(payload: T): void {
        Array.from(this.callbacks.values()).forEach(callback => callback(payload));
    }
}