import * as Redux from 'redux';

// Dynamic reducers
class ReducerRegistry {
    private _reducers: {[name: string]: Redux.Reducer} = {};
    private _emitChange: any = null;

    constructor(initialReducers = {}) {
        this._reducers = initialReducers;
    }

    register(reducer: {[name: string]: Redux.Reducer}): void {
        this._reducers = {...this._reducers, ...reducer}
        if (this._emitChange) {
            this._emitChange(this.getReducers());
        }
    }

    getReducers() {
        return {...this._reducers}
    }

    setChangeListener(listener: any): void {
        if (this._emitChange !== null) {
            throw new Error('Cannot set listener for a registry more than once');
        }
        this._emitChange = listener;
    }

    get Redux() {
        return Redux;
    }
}

const combine = (reducers: any) => {
    const names = Object.keys(reducers);
    Object.keys({_: undefined}).forEach(key => {
        if (names.indexOf(key) === -1) {
            reducers[key] = (state: any = null) => state;
        }
    });
    return Redux.combineReducers({...reducers});
}

export const Registry = new ReducerRegistry();
const reducer = combine(Registry.getReducers());

export const store = Redux.createStore(reducer, {});
Registry.setChangeListener((reducers: any) => {
    store.replaceReducer(combine(reducers));
});