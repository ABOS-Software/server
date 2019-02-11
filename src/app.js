const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const sequelize = require('./sequelize');
//const setupTestData = require('./setupTestDataBase');
const jsreport = require('./jsreport');

const authentication = require('./authentication');
Sentry.init({ dsn: 'https://46b1c3524371490ba2b98752ccc1dc5f@sentry.io/1365360' });
Sentry.configureScope(scope => {
  scope.addEventProcessor((event, hint) => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
      event = null;
    }
    return event;
  });
});
const app = express(feathers());
app.use(Sentry.Handlers.requestHandler());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());
/*if (app.get('env') === 'test' || app.get('env') === 'test_local') {
  app.configure(setupTestData);
}*/
app.configure(sequelize);
app.configure(jsreport);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);

// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(Sentry.Handlers.errorHandler());

app.use(express.notFound());
app.use(express.errorHandler({logger}));

app.hooks(appHooks);

module.exports = app;
