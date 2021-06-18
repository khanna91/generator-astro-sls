/**
 * Http Service
 *
 */
const axios = require('axios');
const logger = require('@utils/logger');
const { http } = require('@config/vars');

/* istanbul ignore next */
axios.interceptors.request.use((request) => {
  request.time = new Date().toISOString(); // eslint-disable-line
  logger.info('Axios External API Request', request);
  return request;
});

/* istanbul ignore next */
axios.interceptors.response.use((response) => {
  const { request, status, headers } = response;
  logger.info('Axios External API Response', {
    url: request.path,
    time: new Date().toISOString(),
    status,
    headers
  });
  return response;
});

const createRequest = async (method, url, data, headers, timeout) => {
  const before = Date.now();
  try {
    const result = await axios.request({
      method,
      url,
      data,
      headers,
      timeout
    });
    logger.info('EXTERNAL_API_SUCCESS', {
      url,
      method,
      timeTake: Date.now() - before
    });
    return result;
  } catch (err) {
    console.log(err);
    logger.error('EXTERNAL_API_FAILED', {
      url,
      method,
      timeTake: Date.now() - before
    });
    throw err;
  }
};
exports.createRequest = createRequest;

exports.get = (url, data, headers, timeout = http.timeout) => createRequest('GET', url, data, headers, timeout);

exports.put = (url, data, headers, timeout = http.timeout) => createRequest('PUT', url, data, headers, timeout);

exports.post = (url, data, headers, timeout = http.timeout) => createRequest('POST', url, data, headers, timeout);
