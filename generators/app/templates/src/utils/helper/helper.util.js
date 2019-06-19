const httpStatus = require('http-status');

const OK = (responseMessage = 'OK', response = {}, statusCode = httpStatus.OK) => ({
  statusCode,
  body: JSON.stringify({
    responseCode: statusCode,
    responseMessage,
    response
  }, null, 2)
});

module.exports = {
  OK
};
