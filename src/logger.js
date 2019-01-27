const {createLogger, format, transports} = require('winston');

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const level = () => {
  if (process.env.NODE_ENV !== 'PRODUCTION') {
    return 'debug';
  }
  return 'info';

};
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: level(),
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ],
});

module.exports = logger;
