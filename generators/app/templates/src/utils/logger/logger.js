const winston = require('winston');

const {
  combine,
  colorize,
  simple
} = winston.format;

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
    format: combine(
      colorize(),
      simple()
    )
  }
};

const transports = [
  new winston.transports.Console(options.console)
];

// instantiate a new Winston Logger with the settings defined above
const logger = winston.loggers.add(process.env.NODE_ENV, {
  transports
});

module.exports = {
  logger
};
