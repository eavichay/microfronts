import { channel, EventEmitter } from './messaging';
import { Router, RouteConfig, RouteResolution } from './router';
import { AppContext } from './app-context';
import { MFEvents } from './events.enum';
import { wrapHistoryAPI, historyAPICallbacks } from './history';

let router: Router;

export interface MicroFrontsHandlerInit {
  /**
   * router instance
   */
  router: Router;

  /**
   * event emitter that dispatches route resolution when hash changes
   */
  emitter: EventEmitter<RouteResolution>;

  /**
   * initial route resolution on instantiation
   */
  route: RouteResolution;
}

export type MicroFrontsOptions = {
  /**
   * The iframe custom element's name that will be used. defaults to 'micro-front'
   */
  customElementTag: string;
};

const defaultOptions: MicroFrontsOptions = {
  customElementTag: 'micro-front'
};

let registeredApps: any = {};

export const init = (
  config: {
    routes: { [path: string]: RouteConfig };
    apps: { [appId: string]: string };
  },
  options: MicroFrontsOptions = defaultOptions
): MicroFrontsHandlerInit => {
  if (router) {
    router.destroy();
  }
  const emitter = channel<RouteResolution>('router');
  router = new Router(undefined, emitter);
  router.config(config.routes);
  const resolution: RouteResolution = router.resolve(window.location.href) as RouteResolution;
  registeredApps = config.apps;
  wrapHistoryAPI(router, emitter);

  AppContext.set<MicroFrontsHandlerInit>('initial.route.config', {
    router,
    emitter,
    route: resolution
  });

  AppContext.set('Microfronts', {
    emitter,
    initialRoute: resolution
  });

  const initOptions = Object.assign({}, defaultOptions, options);
  if (!customElements.get(initOptions.customElementTag)) {
    customElements.define(initOptions.customElementTag, MicroFront, {
      extends: 'iframe'
    });
  }
  return AppContext.get<MicroFrontsHandlerInit>('initial.route.config');
};

export const getRouter = (): Router => router;
export const getRouteEmitter = (): EventEmitter<RouteResolution> =>
  channel<RouteResolution>('router');

export default class MicroFront extends HTMLIFrameElement {
  private emitter: EventEmitter<RouteResolution>;
  private router: Router;
  private lastKnownRoute: RouteResolution | undefined;
  private appId = '';

  constructor() {
    super();
    this.sandbox.add('allow-same-origin');
    this.sandbox.add('allow-scripts');
    this.sandbox.add('allow-popups');
    this.sandbox.add('allow-forms');
    const initConfiguration = AppContext.get<MicroFrontsHandlerInit>('initial.route.config');
    this.onRouteChanged = this.onRouteChanged.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
    this.emitter = initConfiguration.emitter;
    this.router = initConfiguration.router;
  }

  static get observedAttributes() {
    return ['app-id'];
  }

  private async loadCustom(url: string): Promise<void> {
    await Promise.resolve();
    const { contentWindow, contentDocument } = this;
    if (!contentDocument || !contentWindow) return;

    const text = await (await fetch(url, {
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin'
    })).text();
    const doc = document.implementation.createHTMLDocument();
    doc.documentElement.innerHTML = text;
    const base = doc.createElement('base');
    base.href = url;
    doc.head.insertBefore(base, doc.head.firstElementChild);
    Object.defineProperty(contentWindow, 'AppContext', { value: AppContext });
    contentDocument.write(doc.documentElement.innerHTML);
    contentDocument.close();
    this.onRouteChanged(this.router.resolve(window.location.href));
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) {
      return;
    }
    if (attr === 'app-id') {
      this.appId = this.getAttribute('app-id') || '';
      const url = registeredApps[this.appId];
      if (url) {
        this.onRouteChanged(this.router.resolve(window.location.href));
        this.loadCustom(url);
      }
    }
  }

  private onStateChanged(
    route: RouteResolution & {
      action: historyAPICallbacks;
      arguments: IArguments;
    }
  ) {
    const action: historyAPICallbacks = route.action;
    const w = this.contentWindow as Window;
    // @ts-ignore
    w.history[action](...route.arguments);
    this.onRouteChanged(route);
  }

  private onRouteChanged(route: RouteResolution = this.lastKnownRoute as RouteResolution): void {
    if (route === this.lastKnownRoute) {
      return;
    }
    this.lastKnownRoute = route;
    const { appId } = this;
    if (route.activeApps.includes(appId)) {
      this.style.display = 'unset';
      this.setAttribute('active', 'true');
    } else {
      this.style.display = 'none';
      this.setAttribute('active', 'false');
    }
    // @ts-ignore
    this.contentWindow.location.hash = window.location.hash;
  }

  connectedCallback() {
    (this.contentWindow as any).AppContext = AppContext;
    const appId = this.getAttribute('app-id');
    if (!appId) {
      return;
    }
    this.onRouteChanged(this.router.resolve(window.location.href));
    this.emitter.on(MFEvents.ROUTE_CHANGED, this.onRouteChanged);
    (this.emitter as EventEmitter<any>).on(MFEvents.NAVIGATION_CHANGE, this.onStateChanged);
  }

  disconnectedCallback() {
    this.emitter.off(MFEvents.ROUTE_CHANGED, this.onRouteChanged);
    (this.emitter as EventEmitter<any>).off(MFEvents.NAVIGATION_CHANGE, this.onStateChanged);
  }
}
