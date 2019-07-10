/* eslint-disable arrow-body-style */
const Joi = require('@hapi/joi');
const { validate, routeValidator } = require('./route-validation.middleware');

describe('Middleware - routeValidator', () => {
  beforeEach(() => {});

  afterEach(() => {});

  it('should validate the if no schema or body pass', () => {
    const result = validate({});
    expect(result).toBeObject();
  });

  it('should validate the schema', () => {
    const result = validate({ name: 'test' }, Joi.object({
      name: Joi.string().required()
    }));
    expect(result).toBeObject();
    expect(result).toContainAllKeys(['name']);
  });

  it('should invalidate the schema', () => {
    try {
      validate({ name: 'test' }, Joi.object({
        name: Joi.string().min(6).required()
      }));
    } catch (err) {
      expect(err.isJoi).toBeTrue();
    }
  });

  it('should do route validation', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required()
      })
    };
    const mockNext = jest.fn();
    routeValidator({ schema }).before({
      event: {
        body: { name: 'test' }
      }
    }, mockNext);
    expect(mockNext.mock.calls.length).toBe(1);
  });

  it('should do nothing and move on to next', () => {
    const mockNext = jest.fn();
    routeValidator({}).after({}, mockNext);
    expect(mockNext.mock.calls.length).toBe(1);
  });
});
