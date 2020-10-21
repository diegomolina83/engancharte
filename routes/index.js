module.exports = app => {

  // Base URLS
  app.use('/', require('./index.routes'))
  app.use('/', require('./auth.routes'))
  app.use('/users', require('./users.routes'))
  app.use('/works', require('./works.routes'))
  app.use('/api', require('./api.routes'))
  app.use('/shop', require('./shop.routes'))

}
