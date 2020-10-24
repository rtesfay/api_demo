const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  let token;

  const authHeader = req.header('Authorization');
  if (authHeader) {
    const bearerAuth = authHeader.split(/\s+/);

    if (bearerAuth.length == 2 && bearerAuth[0] == "Bearer") {
      token = bearerAuth[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Access denied. No token provided.'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, config['jwtPrivateKey']);
    req.user = decoded; 
    next();
  } catch (ex) {
    return res.status(400).json({
      message: 'Invalid token.'
    });
  }
}