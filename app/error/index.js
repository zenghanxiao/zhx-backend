const userErrorMessages = require('./user');
const workErrorMessages = require('./work');
const utilsErrorMessages = require('./utils');

const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
  ...utilsErrorMessages,
};

module.exports = globalErrorMessages;
