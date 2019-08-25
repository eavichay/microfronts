import { AppContext } from '../src/app-context';

describe('require-provide', () => {
  it('From two modules', (done) => {
    const moduleA = {
      appCtx: AppContext,
      doProvide: function () {
        this.appCtx.provide('test-provider.1', () => done());
      }
    };
    const moduleB = {
      appCtx: AppContext,
      doRequire: async function () {
        const testSuccess: Function = await this.appCtx.require('test-provider.1');
        testSuccess();
      }
    }

    moduleA.doProvide();
    moduleB.doRequire();

  });
});