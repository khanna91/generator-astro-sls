const _ = require('lodash');
const Joi = require('@hapi/joi');

/**
 * Function to validate the actual data against Joi Schema
 * @param {object} values               Values which needs to be validated
 * @param {object} schema               Joi Schema
 */
const validate = (values, schema) => {
  if (_.isEmpty(schema)) {
    return values;
  }
  const validateData = Joi.validate(values, schema);
  if (validateData.error) {
    throw validateData.error;
  }
  return validateData.value;
};

/**
 * Middleware to validate request data
 */
const routeValidator = ({ schema }) => ({
  before: (handler, next) => {
    const request = handler.event;
    const {
      body, headers, queryStringParameters, pathParameters
    } = request;
    // validate headers
    handler.event.headers = _.merge(handler.event.headers, validate(headers, schema.headers)); // eslint-disable-line
    // validate query
    handler.event.queryStringParameters = _.merge(handler.event.queryStringParameters, validate(queryStringParameters, schema.query)); // eslint-disable-line
    // validate params (path parameters)
    handler.event.pathParameters = _.merge(handler.event.pathParameters, validate(pathParameters, schema.params)); // eslint-disable-line
    // validate body
    handler.event.body = _.merge(handler.event.body, validate(body, schema.body)); // eslint-disable-line
    // validate(body, schema.body);
    return next();
  },
  after: (handler, next) => next()
});

module.exports = {
  validate,
  routeValidator
};
