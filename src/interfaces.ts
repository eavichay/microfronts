declare global {
    interface Window {
        AppContext: IAppContext;
    }
}

/**
 * Unsubscribes from an dispatcher.
 * Retreived from IDispatcher::Subscirbe function
 */
export type Unsubsciber = () => void;

/**
 * Generic function declaration that receives one typed argument
 */
export type Callback<T> = (data: T) => any;

/**
 * Generic key-value object with specific types as values
 */
export type KeyValue<T = any> = {[key: string]: T};

/**
 * Dispatches data events (optional: event data type T. Defaults to "any").
 * Work similar to RxJs.Subject
 */
export interface IDispatcher<T = any> {
    /**
     * Subscrives to an event
     * @param callback Provide an event handler that receives one argument of type T
     */
    subscribe(callback: Callback<T>) : Unsubsciber;
    /**
     * Unsubscrives from an event
     * @param callback Provide the listening event handler that receives one argument of type T
     */
    unsubscribe(callback: Callback<T>) : void;

    /**
     * Dispatches an event to all event handlers
     * @param data Event data (optional)
     */
    notify(data?: T) : void;
}

/**
 * Information describing the micro application to be loaded
 */

export type AppDescriptor = {
    /** appId Matching name for the [app-id] attribute on the app-container iframe DOM element */
    appId: string;
    /** baseUrl URI for retreiving the application content. example: https://my.server.org/someProduct/index.html */
    baseUrl: string;
    /** optional micro-app specific injection to the window object. */
    staticData?: any;
}

/**
 * Route information describing a router's state
 */
export type RouteInfo = {
    /**
     * First-level route
     * Used to determine with micro-app(s) should be activated
     */
    base: string;
    /**
     * Full path (not including domain)
     */
    full: string;
    /**
     * Route configuration, defaults to an empty config.
     */
    config: RouteConfig;
}

/**
 * Configuration for a specific route
 */
export type RouteConfig = {
    /**
     * Active apps for that route
     */
    active?: Array<AppDescriptor>;
    /**
     * Inactive apps are UNLOADED and released from the memory.
     * WARNING: Use with caution:
     *   when there are cross references between the shell and the micro-app,
     *   or references from another micro-app to an object within the unloaded micro-app,
     *   the behavior is unstable and can cause severe runtime errors.
     */
    inactive?: Array<AppDescriptor>
};

/**
 * Asynchronous checking if a route can be changed, used ONLY when the routing is done via Router::navigate
 * NOTE:
 *   Independent navigation triggered from a micro-app without calling Router::navigate will NOT be
 *   verified by guards.
 */
export interface RouteGuard {
    check: (info: {from: RouteInfo, to: RouteInfo}) => Promise<boolean>;
}

export interface ILocationMode {
    getPath(): string;
    setPath(path: string): void;
    onChange(callback: () => any): void;
}

export type ILocationModeClass = { new (...args: any[]): ILocationMode; }


/**
 * Router used in the Microfronts orchestrator
 */
export interface IRouter extends IDispatcher<RouteInfo> {

    location: ILocationMode;

    /**
     * Until initialized, router may not work properly.
     * Initializing the router should be executed after the registration of routes.
     */
    init():void;
    /**
     * Whenever a route changes, it is reflected as [route] attribute on the marked DOM element.
     * This is useful when different CSS behaviors apply for different routes, or using custom-elements that wraps the app-containers.
     * @param target DOM Element, query selector or undefined. When undefined, the target will be the document's body.
     */
    markDOM(target?: HTMLElement|string): void;
    /**
     * Listens to route changes on the window.
     * If a user manually updates the route, the router will react and propagate the change to the app-containers.
     */
    watchRoot(): void;

    /**
     * Registers a route to manage app-containers.
     * @param base Top-level route name
     * @param routeConfig @see RouteConfig
     */
    registerRoute(base: string, routeConfig: RouteConfig): void;

    /**
     * @param guard Registers a guard @see RouteGuard
     */
    addGuard(guard: RouteGuard): void;
    /**
     * @param guard Unregisters a guard @see RouteGuard
     */
    removeGuard(guard: RouteGuard): void;

    /**
     * Changes the top-frame route after validation with the registered guards. If accepted, propagates the change to all app-containers.
     * @param path
     */
    navigate(path: string): Promise<boolean>;

    /**
     * Current application route
     */
    currentRoute: RouteInfo;
}

/**
 * The application context is injected to all app-containers and accessible in all loaded modules.
 * The appContext enables applications communicate, pass objects, promises and callbacks.
 */
export interface IAppContext {
    /**
     * Retreives a shared object by name
     */
    get<T = any>(name: string): T;
    /**
     * Sets a shared object by name. Can be retreived anywhere using IAppContext::get
     */
    set(name: string, value: unknown): void;

    /**
     * Retreives a shared object, asynchronously. The promise will be resolved one a corresponding provide will be triggered.
     * Useful for accessing objects from other modules that may be loaded in the future, or for asynchronous tasks.
     */
    require<T = any>(name: string): Promise<T>;

    /**
     * Provides a shared object, asynchronously. Fulfills any require called in the past or the future with a value.
     */
    provide(name: string, value: unknown): void;

    /**
     * Access to the micro-frontends router
     */
    readonly router: IRouter;
}

/**
 * @ignore
 */
export interface IAppContainer {
    load(appDescriptor: AppDescriptor): void;
    unload(): void;
    enable(): void;
    disabled(): void;
}
