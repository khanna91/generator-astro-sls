/* eslint-disable arrow-body-style */
const logger = require('@utils/logger');
const { monitoringMiddleware, sendMonitoringLogs } = require('./monitoring.middleware');

describe('Middleware - monitoringMiddleware', () => {
  let infoSpy;
  let errorSpy;

  beforeEach(() => {
    infoSpy = jest.spyOn(logger, 'info');
    errorSpy = jest.spyOn(logger, 'error');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log with next and move on to next', () => {
    const mockFn = jest.fn();
    monitoringMiddleware({}).after({}, mockFn);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log with error and move on to next', () => {
    const mockFn = jest.fn();
    monitoringMiddleware({}).onError({}, mockFn);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should send logs to cloudwatch', () => {
    sendMonitoringLogs({ request: {}, response: { statusCode: 200, body: {} } });
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });
});
