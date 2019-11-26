import { IRouter, RouteInfo, KeyValue, RouteConfig, RouteGuard } from "./interfaces";
import { Dispatcher } from './Messaging.js';

const getBasePath = (path: string) => {
    const match = /[^\/|^#|^?|^\&]+/.exec(path);
    if (match) {
        return match.toString().toLowerCase();
    }
    return '';
}

const getRouteInfo = (path: string): Partial<RouteInfo> => {
    return {
        base: getBasePath(path),
        full: path
    }
}

const nullRouteConfig: RouteConfig = {
   active: [],
   inactive: []
}

Object.seal(nullRouteConfig);

export class Router extends Dispatcher implements IRouter {

    private _markDOMElement: HTMLElement | null = null;
    private _watchRootEnabled = false;
    private _routes: KeyValue<RouteConfig> = {};
    private _guards = new Set<RouteGuard>();
    private _currentRoute: RouteInfo = {
        base: '*',
        full: window.location.hash,
        config: nullRouteConfig
    };

    public get currentRoute() {
        return this._currentRoute;
    }

    public init(): void {
        this.navigate(window.location.hash);
    }
    public markDOM(target?: string | HTMLElement): void {
        if (typeof target === 'string') {
            this._markDOMElement = document.querySelector(target);
        } else if (!!target) {
            this._markDOMElement = target;
        } else {
            this._markDOMElement = document.body;
        }
    }

    private handleRootRouteChanged() {
        this.navigate(window.location.hash);
    }

    public watchRoot(): void {
        if (!this._watchRootEnabled) {
            window.addEventListener('popstate', () => {
                this.handleRootRouteChanged();
            });
            this._watchRootEnabled = true;
        }
    }

    public registerRoute(base: string, routeConfig: RouteConfig): void {
        this._routes[base] = routeConfig;
    }

    public addGuard(guard: RouteGuard): void {
        this._guards.add(guard);
    }

    public removeGuard(guard: RouteGuard): void {
        this._guards.delete(guard);
    }

    public async navigate(path: string): Promise<boolean> {
        const targetRoute = getRouteInfo(path);
        const base = targetRoute.base || '';
        targetRoute.config = this._routes[base] || this._routes['*'] || nullRouteConfig;
        const guards = Array.from(this._guards.values());
        try {
            for (let guard of guards) {
                const resolution = await guard.check({
                    from: this._currentRoute,
                    to: targetRoute as RouteInfo
                });
                if (resolution === false) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }
        if (this._markDOMElement) {
            this._markDOMElement.setAttribute('route', targetRoute.base || '');
        }
        this._currentRoute = targetRoute as RouteInfo;
        window.location.hash = path;
        this.notify(targetRoute);
        return true;
    }
}