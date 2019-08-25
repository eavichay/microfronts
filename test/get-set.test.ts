import { AppContext } from '../src/app-context';

describe('get-set', () => {
  it('Should set and get', (done) => {
    AppContext.set('get-set.1', done);
    AppContext.get('get-set.1')();
  });
});