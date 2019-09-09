const middy = require('middy');
const {
  httpEventNormalizer,
  httpHeaderNormalizer,
  jsonBodyParser,
  urlEncodeBodyParser,
  cors,
  httpSecurityHeaders
} = require('middy/middlewares');
const { errorMiddleware } = require('@middlewares/error');
const { routeValidator } = require('@middlewares/route-validator');
const { monitoringMiddleware } = require('@middlewares/monitoring');

const handler = require('./hello.handler');
const validator = require('./hello.validator');

const handlerWrapper = middy(handler.hello)
  .use(errorMiddleware.converter())
  .use(cors())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(urlEncodeBodyParser({ extended: false }))
  .use(httpSecurityHeaders())
  .use(monitoringMiddleware())
  .use(routeValidator({ schema: validator.joiSchema }));

module.exports = handlerWrapper;
