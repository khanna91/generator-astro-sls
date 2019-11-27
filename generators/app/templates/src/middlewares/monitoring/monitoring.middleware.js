/**
 * Monitoring Middleware
 *
 */
const logger = require('@utils/logger');

const sendMonitoringLogs = async (request) => {
  try {
    const { event, context, response } = request;
    const { body } = response;
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
