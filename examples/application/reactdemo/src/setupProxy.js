module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, cache-control, if-modified-since, pragma, Accept'
    );
    next();
  });
};
