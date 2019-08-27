import { Router, RouteResolution } from './router';
import { EventEmitter } from './messaging';
import { MFEvents } from './events.enum';

let runOnce = false;

const wrapWithEmitter = (
  target: Window,
  proto: any,
  methodName: string,
  router?: Router,
  emitter?: EventEmitter
) => {
  Object.defineProperty(target.history, methodName, {
    value: function() {
      proto[methodName].apply(this, arguments);
      const newURL = target.location.href;
      if (router && emitter) {
        const resolution: RouteResolution = router.resolve(newURL) as RouteResolution;
        emitter.emit('navigation.' + methodName, resolution);
        emitter.emit(MFEvents.NAVIGATION_CHANGE, {
          ...resolution,
          action: methodName,
          arguments
        });
      }
    }
  });
};

export type historyAPICallbacks = 'pushState' | 'replaceState' | 'go' | 'forward' | 'back';

export const wrapHistoryAPI = (router?: Router, emitter?: EventEmitter) => {
  if (runOnce || typeof window === 'undefined' || typeof window.history === 'undefined') {
    return;
  }

  ['popState', 'pushState', 'replaceState', 'go', 'forward', 'back'].forEach(methodName => {
    wrapWithEmitter(window, History.prototype, methodName, router, emitter);
  });

  runOnce = true;
};
