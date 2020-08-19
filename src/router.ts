import {IRouter, RouteInfo, KeyValue, RouteConfig, RouteGuard, ILocationModeClass, ILocationMode} from './interfaces';
import {Dispatcher} from './Messaging.js';
import {HashLocationMode} from './LocationMode';

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
	private _currentRoute: RouteInfo;
	location: ILocationMode;

	constructor(LocationPath: ILocationModeClass = HashLocationMode) {
		super();

		this.location = new LocationPath();
		this._currentRoute = {
			base: '*',
			full: this.location.getPath(),
			config: nullRouteConfig
		};
	}

	get currentRoute() {
		return this._currentRoute;
	}

	init(): void {
		this.navigate(this.location.getPath());
	}

	markDOM(target?: string | HTMLElement): void {
		if (typeof target === 'string') {
			this._markDOMElement = document.querySelector(target);
		} else if (!!target) {
			this._markDOMElement = target;
		} else {
			this._markDOMElement = document.body;
		}
	}

	handleRootRouteChanged() {
		this.navigate(this.location.getPath());
	}

	watchRoot(): void {
		if (!this._watchRootEnabled) {
			this.location.onChange(() => {
				this.handleRootRouteChanged();
			})
			this._watchRootEnabled = true;
		}
	}

	registerRoute(base: string, routeConfig: RouteConfig): void {
		this._routes[base] = routeConfig;
	}

	addGuard(guard: RouteGuard): void {
		this._guards.add(guard);
	}

	removeGuard(guard: RouteGuard): void {
		this._guards.delete(guard);
	}

	async navigate(path: string): Promise<boolean> {
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
		this.location.setPath(path);
		this.notify(targetRoute);
		return true;
	}
}
