/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = process.env.PORT || app.get('port');
require('dotenv').load();

if (app.get('env') !== 'test' && app.get('env') !== 'test_local') {
  const server = app.listen(port);
  server.on('listening', () => {
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
    //app.emit('Ready');
  });
}


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);


