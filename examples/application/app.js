const { AppContext, channel, init, router } = Microfronts;

const APPS = {
  react: 'react',
  angular: 'angular',
  slimjs: 'slimjs'
};

init({
  apps: {
    [APPS.react]: 'http://localhost:3000',
    [APPS.angular]: 'http://localhost:4200',
    [APPS.slimjs]: 'http://localhost:9000'
  },
  routes: {
    '*': {
      active: [APPS.slimjs, APPS.react, APPS.angular]
    },
    '/react': {
      active: [APPS.react],
      disabled: [APPS.slimjs, APPS.angular]
    },
    '/angular': {
      active: [APPS.angular],
      disabled: [APPS.react, APPS.slimjs]
    }
  }
});

// window.history.pushState(null, null, '#/dashboard');
