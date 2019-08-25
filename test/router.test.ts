import { Router, RouteResolution } from '../src/router';
import assert = require('assert');
import { channel } from '../src';
import { MFEvents } from '../src/events.enum';

const mock = {
  addEventListener: () => {},
  removeEventListener: () => {}
};

const stub = {
  '/user': {
    active: ['a', 'b', 'c'],
    disabled: ['x', 'y', 'z']
  },
  '*': {
    active: ['a', 'b', 'c', 'd'],
    disabled: ['e']
  }
};

describe('Router', () => {
  it('Should return correct route info', () => {
    const unit = new Router(mock);
    unit.config(stub);
    const result = unit.resolve('http://some.url#/user/3') as RouteResolution;
    assert(result);
    assert.strictEqual(result.url, 'http://some.url#/user/3');
    assert.strictEqual(result.base, 'user');
    assert.deepEqual(result.activeApps, ['a', 'b', 'c']);
    assert.deepEqual(result.disabledApps, ['x', 'y', 'z']);
  });
  it('Should resolve to default route info', () => {
    const unit = new Router(mock);
    unit.config(stub);
    const result = unit.resolve('http://some.url/#/unknown/path') as RouteResolution;
    assert(result);
    assert.strictEqual(result.url, 'http://some.url/#/unknown/path');
    assert.strictEqual(result.base, 'unknown');
    assert.deepEqual(result.activeApps, ['a', 'b', 'c', 'd']);
    assert.deepEqual(result.disabledApps, ['e']);
  });
  it.only('Using event emitter for changes', () => {
    let addEventListenerCalled = false;
    let removeEventListenerCalled = false;
    let emitterResponseOk = false;
    const windowMock = {
      callback: undefined,
      addEventListener: function(eventName: string, cb: Function) {
        // @ts-ignore
        this.callback = cb;
        assert.strictEqual(eventName, 'hashchange');
        addEventListenerCalled = true;
      },
      removeEventListener: function(eventName: string, cb: Function) {
        assert.strictEqual(cb, this.callback);
        assert.strictEqual(eventName, 'hashchange');
        removeEventListenerCalled = true;
      }
    };
    const fakeEvent = {
      newURL: 'http://some.url/#/unknown'
    };
    const emitter = channel<RouteResolution>('blah');

    // initialize unit
    // @ts-ignore
    const unit = new Router(windowMock, emitter);
    unit.config(stub);
    emitter.on(MFEvents.ROUTE_CHANGED, (data) => {
      assert.strictEqual(data.url, fakeEvent.newURL);
      assert.strictEqual(data.base, 'unknown');
      assert.deepEqual(data.activeApps, stub['*'].active);
      assert.deepEqual(data.disabledApps, stub['*'].disabled);
      emitterResponseOk = true;
    });

    // @ts-ignore
    windowMock.callback(fakeEvent);

    unit.destroy();

    // ensure addEventListener is called
    assert(typeof windowMock.callback === 'function');
    assert(addEventListenerCalled);
    assert(removeEventListenerCalled);
    assert(emitterResponseOk);
  });
});
