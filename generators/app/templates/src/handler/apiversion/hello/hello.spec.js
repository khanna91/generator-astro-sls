/* eslint-disable arrow-body-style */
const httpStatus = require('http-status');
const handler = require('./hello.handler');

describe('Test hello', () => {
  let event;
  beforeEach(() => {
    event = {};
  });

  afterEach(() => {
    event = undefined;
    jest.resetAllMocks();
  });

  it('should return valid response', async () => {
    const { statusCode, body } = await handler.hello(event);
    expect(statusCode).toBe(httpStatus.OK);
    const result = JSON.parse(body);
    expect(result.responseCode).toBe(httpStatus.OK);
    expect(result.responseMessage).toBeString();
    expect(result.response).toBeObject();
  });
});
