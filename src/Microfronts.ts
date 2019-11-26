import { IRouter, IAppContext as $IAppContext } from "./interfaces.js";
import { AppContext } from './AppContext.js';
import './AppContainer';

let instance: MicrofrontsOrchestrator;

export interface IAppContext extends $IAppContext {}

export interface IOrchestrator {
    getRouter(): IRouter;
    getAppContext(): IAppContext;
}

class MicrofrontsOrchestrator {
    private appCtx = new AppContext();
    private router: IRouter = this.appCtx.router;

    public getRouter() {
        return this.router;
    }

    public getAppContext() {
        return this.appCtx;
    }
}

export const Microfronts = (): MicrofrontsOrchestrator => {
    if (!instance) {
        instance = new MicrofrontsOrchestrator();
    }
    return instance;
}