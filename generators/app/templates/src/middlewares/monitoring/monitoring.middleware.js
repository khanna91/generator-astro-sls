/**
 * Monitoring Middleware
 *
 */
const { logger } = require('@utils/logger');

const sendMonitoringLogs = async (request) => {
  try {
    const { event, context, response } = request;
    let { body } = response;
    try {
      body = JSON.parse(response.body);
    } catch (err) {
      logger.error('Cannot parse response body');
    }
    const logData = {
      request: event,
      context,
      response: body,
      statusCode: response.statusCode
    };
    logger.info('API Request', logData);
  } catch (error) {
    logger.error('Monitoring error', error);
  }
};

const monitoringMiddleware = () => ({
  after: (handler, next) => {
    sendMonitoringLogs(handler);
    next();
  },
  onError: (handler, next) => {
    sendMonitoringLogs(handler);
    next();
  }
});

module.exports = {
  monitoringMiddleware,
  sendMonitoringLogs
};
