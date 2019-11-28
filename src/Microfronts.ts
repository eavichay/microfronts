import { IRouter, IAppContext } from "./interfaces.js";
import { AppContext } from './AppContext.js';

let instance: MicrofrontsOrchestrator;

/**
 * The microfronts instance. Singleton.
 */
export interface IOrchestrator {
    getRouter(): IRouter;
    getAppContext(): IAppContext;
}

class MicrofrontsOrchestrator implements IOrchestrator {
    private appCtx = new AppContext();
    private router: IRouter = this.appCtx.router;

    public getRouter() {
        return this.router;
    }

    public getAppContext() {
        return this.appCtx;
    }
}

/**
 * Provides access to the Microfronts orchestrator singleton
 * @returns IOrchestrator
 */
export const Microfronts = (): IOrchestrator => {
    if (!instance) {
        instance = new MicrofrontsOrchestrator();
    }
    return instance;
}