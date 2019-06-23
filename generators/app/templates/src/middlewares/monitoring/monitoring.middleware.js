/**
 * Monitoring Middleware
 *
 */
const { logger } = require('@utils/logger');

const sendMonitoringLogs = async (event) => {
  try {
    const { request, context, response } = event;
    let { body } = response;
    try {
      body = JSON.parse(response.body);
    } catch (err) {
      logger.error('Cannot parse response body');
    }
    const logData = {
      request,
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
