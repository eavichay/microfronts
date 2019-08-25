const koa = require('koa');
const proxy = require('koa-proxy');

const app = new koa();

app.use(
  proxy({
    host: 'http://localhost:4200',
    map: path => {
      return path.slice(8);
    },
    match: /^\/angular\//
  })
);
app.use(
  proxy({
    host: 'http://localhost:3000',
    map: path => {
      return path;
    },
    match: /^\/[react|static]\//
  })
);

app.use(
  proxy({
    host: 'http://localhost:5050',
    map: path => {
      console.log(path);
      return '/examples/application/' + path;
    },
    match: /^(?!\/[react|angular])/
  })
);

app.listen(8000);
