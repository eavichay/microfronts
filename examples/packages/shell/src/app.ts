import { Microfronts } from '../../../../dist/index';
import { AppDescriptor, RouteInfo } from '../../../../dist/interfaces';
import { coreReducers } from './store/coreReducers';
import { Registry, store } from './store/store';
const microfronts = Microfronts();
const router = microfronts.getRouter();
const appContext = microfronts.getAppContext();

window.AppContext = appContext;

// for the demo, we will inject redux + "core" reducer via the application context, to be used by any app

Registry.register(coreReducers);

store.dispatch({
    type: 'todos.add',
    todo: {
        done: false,
        text: 'First todo item'
    }
});

window.AppContext.provide('reducerRegistry', Registry);
window.AppContext.set('applicationState', store);
window.AppContext.set('nativeState', {
    clicks: 0
});

const REACT_APP: AppDescriptor = {
    baseUrl: 'http://localhost:3000',
    appId: 'react'
};

const ANGULAR_APP: AppDescriptor = {
    baseUrl: 'http://localhost:4200',
    appId: 'angular'
};

const ERROR404_APP: AppDescriptor = {
    baseUrl: './404.html',
    appId: 'error404'
};

router.markDOM();
router.watchRoot();

// unknown routes
router.registerRoute('*', {
    active: [ERROR404_APP]
});

// #/react
router.registerRoute('react', {
    active: [REACT_APP]
});

// #/angular
router.registerRoute('angular', {
    active: [ANGULAR_APP]
});

// #/angular-2
router.registerRoute('angular-2', {
    active: [ANGULAR_APP]
});

// #/both
router.registerRoute('both', {
    active: [ANGULAR_APP, REACT_APP]
});

// if base has no route - will be detected and redirected in the subscription function below
router.registerRoute('', {});
router.subscribe((routeInfo: RouteInfo) => {
    if ((routeInfo.config.active || []).length === 0) {
        router.navigate('/angular');
    }
});

router.init();
