import { IAppContext, KeyValue, IRouter } from "./interfaces";
import { Router } from './Router';

export class AppContext implements IAppContext {
    private _properties: KeyValue = {};
    private _providers: KeyValue<Promise<any>> = {};
    private _resolvers: KeyValue<Function> = {};
    private _router: IRouter;

    constructor(router: IRouter = new Router()) {
        this._router = router;
    }

    public get router() {
        return this._router;
    }

    private _getOrCreateResolution<T = any>(name: string): Promise<T> {
        if (!this._providers[name]) {
            this._providers[name] = new Promise<T>(
                resolve => (this._resolvers[name] = resolve)
            );
        }
        return this._providers[name];
    }

    public get<T = any>(name: string): T {
        return this._properties[name];
    }

    public set<T = any>(name: string, value: T): void {
        this._properties[name] = value;
    }

    public require<T = any>(name: string): Promise<T> {
        return this._getOrCreateResolution<T>(name);
    }

    public getRouter():IRouter|undefined {
        return this._router;
    }

    public provide(name: string, value: any): void {
        void this._getOrCreateResolution(name);
        this._resolvers[name](value);
    }
}