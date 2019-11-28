declare global {
    interface Window {
        AppContext: IAppContext;
    }
}

export type Unsubsciber = () => void;

export type Callback<T> = (data: T) => any;

export type KeyValue<T = any> = {[key: string]: T};

export interface IDispatcher<T = any> {
    subscribe(callback: Callback<T>) : Unsubsciber;
    unsubscribe(callback: Callback<T>) : void;
    notify(data: T) : void;
}

export interface IMessageBus {
    on: <T = any>(eventName: string, callback: Callback<T>) => Unsubsciber;
    off: (eventName: string, callback: Callback<any>) => void;
    notify: (eventName: string, data: any) => void;
}

export type AppDescriptor = {
    appId: string;
    baseUrl: string;
    staticData?: any;
}

export type RouteInfo = {
    base: string;
    full: string;
    config: RouteConfig;
}

export type RouteConfig = {
    active?: Array<AppDescriptor>;
    inactive?: Array<AppDescriptor>
};

export interface RouteGuard {
    check: (info: {from: RouteInfo, to: RouteInfo}) => Promise<boolean>;
}

export interface IRouter extends IDispatcher<RouteInfo> {
    init():void;
    markDOM(target?: HTMLElement|string): void;
    watchRoot(): void;
    registerRoute(base: string, routeConfig: RouteConfig): void;
    addGuard(guard: RouteGuard): void;
    removeGuard(guard: RouteGuard): void;
    navigate(path: string): Promise<boolean>;
    currentRoute: RouteInfo;
}

export interface IAppContext {
    get<T = any>(name: string): T;
    set(name: string, value: unknown): void;
    require<T = any>(name: string): Promise<T>;
    provide(name: string, value: unknown): void;
    readonly router: IRouter;
}

export interface IAppContainer {
    load(appDescriptor: AppDescriptor): void;
    unload(): void;
    enable(): void;
    disabled(): void;
}