/* eslint-disable arrow-body-style */

const httpStatus = require('http-status');
const toBeType = require('jest-tobetype');
const Joi = require('@hapi/joi');
const logger = require('@utils/logger');
const { APIError } = require('@utils/APIError');

expect.extend(toBeType);

const {
  convertGenericError,
  convertValidationError,
  errorHandler,
  converter
} = require('./error.middleware');

describe('Middleware - error', () => {
  const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30)
      .required()
  });
  const { error } = Joi.validate({ a: 'a string' }, schema);
  let errorSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(logger, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should convert validation error into API error with custom route', () => {
    const apiError = convertValidationError(error);

    expect(apiError).toHaveProperty('name');
    expect(apiError).toHaveProperty('errors');
    expect(apiError).toHaveProperty('status');
    expect(apiError).toHaveProperty('errors');
    expect(apiError).toHaveProperty('isPublic');
    expect(apiError).toHaveProperty('route');
    expect(apiError).toHaveProperty('isOperational');
    expect(apiError.name).toBe('APIError');
    expect(apiError.status).toBe(httpStatus.BAD_REQUEST);
    expect(apiError.errors).toBeType('array');
    expect(apiError.errors).not.toHaveLength(0);
    expect(apiError.errors[0]).toHaveProperty('errorCode');
    expect(apiError.errors[0].errorCode).toBe('VALIDATION_ERROR');
    expect(apiError.errors[0]).toHaveProperty('errorTitle');
    expect(apiError.errors[0].errorTitle).toBe('We seems to have a problem!');
    expect(apiError.errors[0]).toHaveProperty('errorDescription');
    expect(apiError.errors[0].errorDescription).toBe('We have some trouble validating your data - please contact our customer support');
    expect(apiError.errors[0]).toHaveProperty('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).toBe('"name" is required');
  });

  it('should convert generic error into API error', () => {
    const err = new Error('Something went wrong');

    const apiError = convertGenericError(err);
    expect(apiError).toHaveProperty('name');
    expect(apiError).toHaveProperty('errors');
    expect(apiError).toHaveProperty('status');
    expect(apiError).toHaveProperty('errors');
    expect(apiError).toHaveProperty('isPublic');
    expect(apiError).toHaveProperty('route');
    expect(apiError).toHaveProperty('isOperational');
    expect(apiError.name).toBe('APIError');
    expect(apiError.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(apiError.errors).toBeType('array');
    expect(apiError.errors).not.toHaveLength(0);
    expect(apiError.errors[0]).toHaveProperty('errorCode');
    expect(apiError.errors[0].errorCode).toBe('UNCAUGHT');
    expect(apiError.errors[0]).toHaveProperty('errorTitle');
    expect(apiError.errors[0].errorTitle).toBe('We seems to have a problem!');
    expect(apiError.errors[0]).toHaveProperty('errorDescription');
    expect(apiError.errors[0].errorDescription).toBe('Our internal system is having problem, please contact our administrator!');
    expect(apiError.errors[0]).toHaveProperty('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).toBe('Something went wrong');
  });

  it('handler middleware should return http status message 500', () => {
    const err = new Error();
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    const result = errorHandler(err);

    expect(result.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('handler middleware should return http status message 400', () => {
    const err = new Error();
    err.status = httpStatus.BAD_REQUEST;
    const result = errorHandler(err);

    expect(result.statusCode).toBe(httpStatus.BAD_REQUEST);
  });

  it('handler middleware should return http status message 500', () => {
    const err = new Error();
    err.status = 0;
    const result = errorHandler(err);

    expect(result.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('handler middleware should return http status message 400 with stacktrace', () => {
    const err = new Error('oops');
    err.status = httpStatus.BAD_REQUEST;
    process.env.NODE_ENV = 'development';
    const result = errorHandler(err);

    expect(result.statusCode).toBe(httpStatus.BAD_REQUEST);
  });

  it('should convert validation error and send json response', () => {
    const mockFn = jest.fn();
    converter().onError({ error }, mockFn);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should convert node error and send json response', () => {
    const err = new Error('Something went wrong');
    const mockFn = jest.fn();
    converter().onError({ error: err }, mockFn);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should convert APIError and send json response', () => {
    const err = APIError.withCode('UNKNOWN');
    const mockFn = jest.fn();
    converter().onError({ error: err }, mockFn);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
