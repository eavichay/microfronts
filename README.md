# Microfronts
> "One shell to rule them all, One shell to bind them, One shell to wrap them all and in the light to run them"

## Polyglot Front-End Solution
Micro-Frontends approach enables us to split our products into separate modules as any of them is built with any web technology (i.e. React/Angular/Vue/...). A thin code layer orchestrates them as a single product, keeping the UX intact. The approach enables companies to stale rewrites of old production code and combine new technologies with legacy ones without breaking everything.

Microfronts orchestrates multiple front-end applications with **shared** runtime and **fully controlled** sandboxing at the same time.

### Creating the shell application
The shell application should be a super-thin layer of html, css and a tiny javascript file.

The shell contains the configuration for your front-ends bound with the releavant routes. The microfronts library will orchestrate the front-ends whenever route changes. It will also provide shared runtime fully accessible by demand.

###### Quick example:
```html
<!-- index.html -->
<body>
  <a href="#/home">HOME (react app)</a>
  <a href="#/home">SETTINGS (angular app)</a>
  <a href="#/side-by-side">SIDE-BY-SIDE (both apps)</a>
  <iframe is="app-container" app-id="react-app"></iframe>
  <iframe is="app-container" app-id="angular-app"></iframe>
  <iframe is="app-container" app-id="error"></iframe>
  <script src="./shell.js" type="module"></script>
</body>
```

`npm install microfronts` or `yarn add microfronts`
Microfronts should be installed in your **shell** application and *NOT* in your applications. This ensures the orchestrator remains a singleton.

```javascript
// shell.js
import { Microfronts } from 'microfronts';
const application = Microfronts();
const router = application.getRouter();
const context = application.getAppContext();

const REACT_APP = {
    base: 'https://my.domain.com/app-1',
    appId: 'react-app'
};
const ANGULAR_APP = {
    base: 'https://other.domain.com/app-2',
    appId: 'angular-app'
};
const NOT_FOUND = {
    base: './404.html',
    appId: 'error'
}

router.registerRoute('*', { active: [NOT_FOUND] });
router.registerRoute('home', { active: [REACT_APP] });
router.registerRoute('settings', { active: [ANGULAR_APP] });
router.registerRoute('side-by-side', { active: [REACT_APP, ANGULAR_APP] });

router.init();
```

> **NOTE:** Ensure your servers provide cross-origin access from where the shell is deployed. This can be solved on the server side or by a reverse-proxy.

To see code example, take a look at the examples folder (available in the github repo).

> For type declarations you may install Microfronts and import only the **interfaces.d.ts** file.

### Accessing the shared context
Microfronts provides a runtime-shared application context, which can be consumed by running front-ends. The context also enables the front-ends to **provide** utilities to other front-ends.

###### For example
Angular holds the user service, containing the data, login and other actions. It exposes a RxJs *Subject* object and would like to expose it to the rest of the world.

```typescript
// angular-app/services/User.service.ts
@Injectable() class UserService {
    public stream$ = new BehaviorSubject<UserData|null>(null);
    constructor() {
        window.AppContext.set('services.stream', this.stream$);
    }
}
```

```javascript
// react-app/components/UserStatus.js
export default () => {
    const [ user, setUserData] = useState(null);
    useEffect(() => {
        const subscription = window.AppContext.get('services.stream')
                .subscribe(data => setUserData(data)));
        return () => subscription.unsubscribe();
        }
    });
    return user
        ? <div>{user.name}, {user.lastLogin}</div>
        : <div></div>
};
```

This way the Angular service can be consumed at runtime within the React application. No need to rewrite or duplicate the business logic.

For asynchronous consumption, The AppContext provides the `provide` and `require` methods. The `require` receives a promise, fulfilled one `provide` is triggered with a value. This enables async dependency management across frameworks.

### Adding more modules to your project
Now that the shell contains at least one front-end, more screens can be added freely. Ensure all of your internal routers use the hash-strategy (for consistency). Use the Microfronts' `Router.Navigate` whenever possible, though the router can watch changes from the inside.

### More to come
Microfronts provides more features, such as route guards (used for dirty-clean state checking, privileges, etc.), static data per-application, messaging and more.

# We need your support!
If you wish to join - open an issue, suggest an improvement, create pull-request or join the team.

Currently documentation is only inside the code, we appreciate help wiring up a good documentation webpage.

`#usetheplatform`
