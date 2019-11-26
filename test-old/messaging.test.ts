import { EventEmitter, channel } from "../src/messaging";

const assert = require('assert');

describe('Messaging', () => {
  describe('on', () => {
    it('Should trigger', (done) => {
      const emitter = new EventEmitter();
      emitter.on('trigger', (value: Function) => {
        value();
      });
      emitter.emit('trigger', done);
    });

    it('Should trigger multiple', () => {
      let trigger1 = undefined;
      let trigger2 = undefined;
      let trigger3 = undefined;
      const emitter = new EventEmitter<number>();
      emitter.on('t', payload => trigger1 = payload);
      emitter.on('t', payload => trigger2 = payload);
      emitter.on('t', () => trigger3 = 3);
      emitter.emit('t', 1);
      emitter.emit('t', 2);
      assert.strictEqual(trigger1, 2);
      assert.strictEqual(trigger2, 2);
      assert.strictEqual(trigger3, 3);
    });
  });

  describe('off', () => {
    it('Should not trigger once callback removed', done => {
      const emitter = new EventEmitter();
      const failTest = () => {
        throw new Error('This should not have been invoked');
      };
      emitter.on('trigger', failTest);
      emitter.off('trigger', failTest);
      emitter.emit('trigger');
      done();
    });

    it('Should remove only some of the callbacks', done => {
      const emitter = new EventEmitter();
      const failTest = () => {
        throw new Error('This should not have been invoked');
      }
      const passTest = () => {
        done();
      }
      emitter.on('trigger', failTest);
      emitter.on('trigger', passTest);
      emitter.off('trigger', failTest);
      emitter.emit('trigger');
    });
  });

  it('EventEmitter:emit - order of execution', () => {
    const results: Array<number> = [];
    const emitter = new EventEmitter();
    emitter.on('trigger', () => results.push(0));
    emitter.on('trigger', () => results.push(1));
    emitter.on('trigger', () => results.push(2));
    emitter.emit('trigger');
    assert.strictEqual(0, results[0]);
    assert.strictEqual(1, results[1]);
    assert.strictEqual(2, results[2]);
  });

  describe('Channels', () => {
    it('Should create channels', (done) => {
      const c1 = channel<Function>('channel1');
      const c2 = channel('channel2');
      assert(c1 instanceof EventEmitter);
      assert(c2 instanceof EventEmitter);
      c1.on('trigger', (fn) => fn());
      c2.on('trigger', () => {
        throw new Error('should not have been invoked');
      });
      c1.emit('trigger', done);
    });
  });
});