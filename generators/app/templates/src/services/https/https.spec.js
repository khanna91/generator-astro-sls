jest.mock('axios');
const axios = require('axios');
const config = require('@config/vars');
const https = require('./https.service');

describe('HTTP Service', () => {
  it('GET - should call with correct method', async () => {
    const testUrl = 'https://www.google.com';
    axios.request.mockImplementation(() => Promise.resolve({ data: true }));
    const { data } = await https.get(testUrl);
    expect(data).toBeTruthy();
    expect(axios.request).toHaveBeenCalledWith({
      method: 'GET',
      data: undefined,
      headers: undefined,
      timeout: config.http.timeout,
      url: testUrl
    });
  });

  it('POST - should call with correct method', async () => {
    const testUrl = 'https://www.google.com';
    const testPayload = { flag: true };
    axios.request.mockImplementation(() => Promise.resolve({ data: true }));
    const { data } = await https.post(testUrl, testPayload);
    expect(data).toBeTruthy();
    expect(axios.request).toHaveBeenCalledWith({
      method: 'POST',
      data: testPayload,
      headers: undefined,
      timeout: config.http.timeout,
      url: testUrl
    });
  });

  it('PUT - should call with correct method', async () => {
    const testUrl = 'https://www.google.com';
    const testPayload = { flag: true };
    axios.request.mockImplementation(() => Promise.resolve({ data: true }));
    const { data } = await https.put(testUrl, testPayload);
    expect(data).toBeTruthy();
    expect(axios.request).toHaveBeenCalledWith({
      method: 'PUT',
      data: testPayload,
      headers: undefined,
      timeout: config.http.timeout,
      url: testUrl
    });
  });

  it('PUT - should throw error', async () => {
    const testUrl = 'https://www.google.com';
    const testPayload = { flag: true };
    axios.request.mockImplementation(() => Promise.reject(new Error('oops')));
    try {
      await https.put(testUrl, testPayload);
    } catch (error) {
      expect(axios.request).toHaveBeenCalledWith({
        method: 'PUT',
        data: testPayload,
        headers: undefined,
        timeout: config.http.timeout,
        url: testUrl
      });
      expect(error).toBeObject();
    }
  });
});
