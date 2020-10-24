const userRoute = require('../routes/user');
const productRoute = require('../routes/product');
const cartRoute = require('../routes/cart');
const checkAuth = require('../middleware/auth');

module.exports = function(app) {
  app.use('/api/users', userRoute);
  app.use('/api/products', checkAuth, productRoute);
  app.use('/api/cart', checkAuth, cartRoute);
}