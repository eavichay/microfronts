import {ILocationMode} from './interfaces';

class LocationMode {
	onChange(callback: () => any) {
		window.addEventListener('popstate', callback);
	}
}

export class HashLocationMode extends LocationMode implements ILocationMode {
	getPath(): string {
		return window.location.hash;
	}

	setPath(path: string) {
		window.location.hash = path;
	}
}


export class HistoryLocationMode extends LocationMode implements ILocationMode {
	getPath(): string {
		return window.location.pathname;
	}

	setPath(path: string) {
		if (path !== this.getPath()) {
			const state = { path };
			window.history.pushState(state, path, path);
			dispatchEvent(new PopStateEvent('popstate', { state }));
		}
	}
}
