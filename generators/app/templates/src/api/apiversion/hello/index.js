const middy = require('middy');
const { routeValidator } = require('../../../middlewares/route-validator');
const controller = require('./hello.controller');
const validator = require('./hello.validator');

const handler = middy(controller.hello).use(routeValidator({ schema: validator.JoiSchema }));

module.exports = handler;
