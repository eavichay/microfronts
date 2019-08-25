const { AppContext, channel, init, router } = Microfronts;

const APPS = {
  react: 'react',
  angular: 'angular',
  slimjs: 'slimjs'
};

init({
  '/': {
    active: [APPS.slimjs],
    disabled: [APPS.react, APPS.angular]
  },
  '/react': {
    active: [APPS.react],
    disabled: [APPS.slimjs, APPS.angular]
  },
  '/angular': {
    active: [APPS.angular],
    disabled: [APPS.react, APPS.slimjs]
  }
});

window.history.pushState(null, null, '#/dashboard');
