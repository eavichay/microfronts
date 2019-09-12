import { IEventEmitter } from './messaging';
import { MFEvents } from './events.enum';

type KeyValue<T = any> = { [key: string]: T };

type Context = {
  addEventListener: typeof Element.prototype.addEventListener,
  removeEventListener: typeof Element.prototype.removeEventListener,
  location: Location,
  history: History
}

const getRouteBase = (url: string): string => {
  try {
    return url
      .split('/')
      .filter(part => !!part)[0];
  } catch (err) {
    return '';
  }
};

const getHashBase = (url: string): string => {
  const idx = url.indexOf('#');
  if (idx < 0) {
    const urlObject = new URL(url);
    return getRouteBase(urlObject.pathname);
  }
  try {
    return getRouteBase(url.split('#')[1]);
  } catch (err) {
    return '';
  }
};
  
export type RouteConfig = {
  active?: Array<string>;
  disabled?: Array<string>;
};

export type RouteResolution = {
  url: string;
  base: string;
  activeApps: Array<string>;
  disabledApps: Array<string>;
};


export class Router {

  private channel: IEventEmitter | undefined;
  private context: Context|undefined;
  private activeApps: KeyValue<Array<string>> = {};
  private disabledApps: KeyValue<Array<string>> = {};
  private lastResolution: RouteResolution|undefined;

  private hashChangeHandler(event: HashChangeEvent): void {
    this.lastResolution = this.resolve(event.newURL);
    if (this.channel) {
      this.channel.emit(MFEvents.ROUTE_CHANGED, this.lastResolution);
    }
  }

  constructor(context: Context = window, channel?: IEventEmitter<RouteResolution>) {

    this.hashChangeHandler = this.hashChangeHandler.bind(this);
    this.channel = channel;
    this.context = context;

    this.context.addEventListener('hashchange', this.hashChangeHandler as EventListener);
  }

  destroy() {
    if (this.context) {
      this.context
        .removeEventListener('hashchange', this.hashChangeHandler as EventListener);
    }
    this.activeApps = {};
    this.disabledApps = {};
    this.context = undefined;
  }

  private registerActiveApp(path: string, app: string): void {
    const base = getRouteBase(path);
    this.activeApps[base].push(app);
  }

  private registerInactiveApp(path: string, app: string): void {
    const base = getRouteBase(path);
    this.disabledApps[base].push(app);
  }

  public config(cfg: KeyValue<RouteConfig>): void {
    Object.entries(cfg).forEach(([path, routeConfig]) => {
      const { active = [], disabled = [] } = routeConfig;
      const base = getRouteBase(path);
      this.disabledApps[base] = this.disabledApps[base] || [];
      this.activeApps[base] = this.activeApps[base] || [];
      active.forEach(appName => this.registerActiveApp(path, appName));
      disabled.forEach(appName => this.registerInactiveApp(path, appName));
    });
  }

  public applyState(data: any = null, title: string = '', url = '/') {
    (this.context as Context).history.pushState(data, title, url);
  }

  public applyHash(hash: string): void {
    (this.context as Context).location.hash = hash;
  }

  public resolve(url?: string): RouteResolution|undefined {
    if (!url) {
      return this.lastResolution;
    }
    const base = getHashBase(url);
    const activeApps = this.activeApps[base] || this.activeApps['*'] || [];
    const disabledApps = this.disabledApps[base] || this.disabledApps['*'] || [];
    return {
      url,
      base,
      activeApps,
      disabledApps
    };
  }
}