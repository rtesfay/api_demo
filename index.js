require('express-async-errors');
const config = require('./config');
const debug = require('debug')('app:startup');
const debugExpress = require('debug')('app:express');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Handle Uncaught Exceptions
process.on('uncaughtException', error => {
  debug(error)
  process.exit(1)
})

// Handle Uncaught Rejection
process.on('unhandledRejection', error => {
  debug(error)
  process.exit(1)
});

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection
db.on('open', () => debug(`Connected to ${process.env.MONGODB_URL || config.db}...`));
db.on('error', error => {
  debug(error);
  debug(`Error Connecting to ${process.env.MONGODB_URL || config.db}...`);
  process.exit(1);
});

const app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());

// app routes
require('./routes')(app);

// info route
app.get('/api', function (req, res) {
  res.json({
    apiRoute: '/api',
    documentationRoute: '/doc'
  });
});

// 404 route
app.use(function (req, res, next) {
	res.status(404).json({
		error: {
			message: 'Resource not found.'
		}
	});
});

// development error handler
if (app.get('env') == 'development') {
  app.use(function(err, req, res, next) {
    debugExpress(err);
    const message = err.isJoi ? err.details[0].message : err.message;
    const status = err.isJoi ? 400 : null;
    res.status(status || err.status || 500).json({
      error: {
        message: message || "Internal server error"
      },
      raw: err,
      info: 'Detailed error is provided. Only for development!'
    });
  });
}

// production error handler
app.use(function (err, req, res, next) {
  debugExpress(err);
  const message = err.isJoi ? err.details[0].message : null;
  const status = err.isJoi ? 400 : null;
  res.status(status || 500).json({
    error: {
      message: message || "Internal server error"
    }
  });
});

app.listen(config.port, () => {
	debug(`Listening on port ${config.port}...`);
});
