/* eslint-disable arrow-body-style */
const httpStatus = require('http-status');
const controller = require('./hello.controller');

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
    const { statusCode, body } = await controller.hello(event);
    expect(statusCode).toBe(httpStatus.OK);
    const result = JSON.parse(body);
    expect(result.responseCode).toBe(httpStatus.OK);
    expect(result.responseMessage).toBeString();
    expect(result.response).toBeObject();
  });
});
