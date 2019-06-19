module.exports = {
  UNSPECIFIED: {
    errTitle: 'Error code not specified',
    errDesc: 'Please try again, if problem still persist, please contact web master',
    errDebugDesc: 'Error code not specified in the system'
  },
  UNKNOWN: {
    errTitle: 'Oops...something went wrong',
    errDesc: 'System is not responding properly',
    errDebugDesc: 'System is not able to handle the error gracefully'
  },
  EXTERNAL_SERVICE_TIMEOUT: {
    errTitle: 'External service getting timed out',
    errDesc: 'Please try again, if problem still persist, please contact web master',
    errDebugDesc: 'External Service not responding in stipulated time'
  }
};
