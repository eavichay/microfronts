import { Microfronts, IOrchestrator,  } from './Microfronts';
import { RouteInfo } from './interfaces';


class AppContainer extends HTMLIFrameElement {

    private appId: string = '';
    private isLoaded: boolean = false;
    private routerSubscription: Function = () => {};

    private orchestrator: IOrchestrator|undefined;

    constructor() {
        super();
        this.sandbox.add('allow-same-origin');
        this.sandbox.add('allow-scripts');
        this.sandbox.add('allow-popups');
        this.sandbox.add('allow-forms');

        this.onHashChanged = this.onHashChanged.bind(this);
        this.navigationHandler = this.navigationHandler.bind(this);
    }

    static get observedAttributes() {
        return ['app-id'];
    }

    protected attributeChangedCallback() {
        try {
            this.appId = this.getAttribute('app-id') || '';
        } catch (err) {}
    }

    connectedCallback() {
        requestAnimationFrame(() => {
            this.orchestrator = Microfronts();
            this.routerSubscription = this.orchestrator.getRouter().subscribe(this.navigationHandler);
            this.navigationHandler();
        });
    }

    disconnectedCallback() {
        this.routerSubscription();
    }

    private async navigationHandler(routeInfo: RouteInfo = (<IOrchestrator>this.orchestrator).getRouter().currentRoute) {
        const activeAppConfig = (routeInfo.config.active || []).find(routeConfig => routeConfig.name === this.appId);
        if (activeAppConfig) {
            Object.defineProperty(this.contentWindow, "RouteContext", { 
                configurable: true,
                writable: false,
                value: activeAppConfig.staticData
            });
            this.load(activeAppConfig.baseUrl);
            this.hidden = false;
        } else {
            this.hidden = true;
        }
        const inactiveAppConfig = (routeInfo.config.inactive || []).find(routeConfig => routeConfig.name === this.appId);
        if (inactiveAppConfig) {
            this.src = "about:blank";
            this.hidden = true;
            this.isLoaded = false;
        }
        if (this.isLoaded) {
            this.applyPath(routeInfo.full);
        }
    }

    private async load(url: string): Promise<void> {
        const orchestartor = this.orchestrator as IOrchestrator;
        if (this.isLoaded) {
            return;
        }
        await Promise.resolve();
        const { contentWindow, contentDocument } = this;
        if (!contentDocument || !contentWindow) return;

        const text = await (await fetch(url, {
            mode: 'cors',
            referrerPolicy: 'origin-when-cross-origin'
        })).text();
        this.isLoaded = true;
        const doc = document.implementation.createHTMLDocument();
        doc.documentElement.innerHTML = text;
        const base = doc.createElement('base');
        base.href = url;
        doc.head.insertBefore(base, doc.head.firstElementChild);
        Object.defineProperty(contentWindow, 'AppContext', { value: orchestartor.getAppContext() });
        contentDocument.write(doc.documentElement.innerHTML);
        contentDocument.close();
        contentWindow.addEventListener('popstate', this.onHashChanged);
        this.applyPath(orchestartor.getRouter().currentRoute.full);
    }

    private applyPath(hash: string) {
        (<WindowProxy>this.contentWindow).location.hash = hash;
    }

    private onHashChanged() {
        (<IOrchestrator>this.orchestrator).getRouter().navigate((<WindowProxy>this.contentWindow).location.hash);
    }
}

customElements.define('app-container', AppContainer, {
    extends: 'iframe'
});