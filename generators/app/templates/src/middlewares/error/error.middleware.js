const httpStatus = require('http-status');
const _ = require('lodash');
const { APIError, generateError } = require('@utils/APIError');
const logger = require('@utils/logger');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const errorHandler = (err) => { // eslint-disable-line
  const response = {
    responseCode: err.status,
    responseMessage: err.message || httpStatus[err.status],
    response: {
      errors: err.errors,
      stack: err.stack
    }
  };
  logger.error('Application Error Stack', { errorStack: err.stack || err.message });
  if (process.env.NODE_ENV !== 'development') {
    delete response.response.stack;
    delete response.input;
  }
  let statusCode = 500;
  if (err.status >= 100 && err.status < 600) {
    statusCode = err.status;
  }

  return {
    statusCode,
    body: JSON.stringify(response, null, 2)
  };
};
exports.errorHandler = errorHandler;

/**
 * Convert Validaton error into APIError
 *
 * @param  {Object} err   Error object
 * @param  {Object} req   Request object
 */
const convertValidationError = (err) => {
  const formattedErrors = [];
  err.details.forEach((error) => {
    formattedErrors.push(generateError(
      'VALIDATION_ERROR',
      'We seems to have a problem!',
      'We have some trouble validating your data - please contact our customer support',
      error.message,
      _.omit(error, ['message'])
    ));
  });

  return new APIError({
    message: 'Validation error',
    errors: formattedErrors,
    route: 'default',
    status: 400,
    stack: err.stack
  });
};

exports.convertValidationError = convertValidationError;

/**
 * Convert generic error into APIError
 *
 * @param  {Object} err   Error object
 * @param  {Object} req   Request object
 * @oublic
 */
const convertGenericError = (err) => {
  const wrappedError = generateError(
    'UNCAUGHT',
    'We seems to have a problem!',
    'Our internal system is having problem, please contact our administrator!',
    err.message, []
  );

  return new APIError({
    message: 'Internal server error',
    errors: [wrappedError],
    route: 'default',
    status: httpStatus.INTERNAL_SERVER_ERROR,
    stack: err.stack
  });
};

exports.convertGenericError = convertGenericError;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = () => {  // eslint-disable-line
  return ({
    onError: (handler, next) => {
      const err = handler.error;
      let convertedError = err;
      if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        convertedError = convertValidationError(err);
      } else if (!(err instanceof APIError)) {
        convertedError = convertGenericError(err);
      }
      handler.response = errorHandler(convertedError); // eslint-disable-line
      return next();
    }
  });
};
