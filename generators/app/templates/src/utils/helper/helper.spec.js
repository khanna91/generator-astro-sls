/* eslint-disable arrow-body-style */
const httpStatus = require('http-status');
const util = require('./helper.util');

describe('Utility - helper', () => {
  beforeEach(() => {});

  afterEach(() => {});

  it('should return OK response', () => {
    const { statusCode, body } = util.OK();
    expect(statusCode).toBe(httpStatus.OK);

    const result = JSON.parse(body);
    expect(result.responseCode).toBe(httpStatus.OK);
    expect(result.responseMessage).toBe('OK');
    expect(result.response).toBeObject();
  });
});
