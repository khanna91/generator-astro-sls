const Joi = require('@hapi/joi');

/**
 * Function to validate the actual data against Joi Schema
 * @param {object} values               Values which needs to be validated
 * @param {object} schema               Joi Schema
 */
const validate = (values, schema) => {
  const validateData = Joi.validate(values || {}, schema || {});
  if (validateData.error) {
    throw validateData.error;
  }
  return true;
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
    validate(headers, schema.headers);
    // validate query
    validate(queryStringParameters, schema.query);
    // validate params (path parameters)
    validate(pathParameters, schema.params);
    // validate body
    validate(body, schema.body);
    return next();
  },
  after: (handler, next) => next()
});

module.exports = {
  validate,
  routeValidator
};
