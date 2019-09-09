const { OK } = require('@utils/helper');
const logger = require('@utils/logger');

exports.hello = async (event) => {
  logger.info('im inside hello controller');
  return OK('Hello API', {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: event
  });
};
