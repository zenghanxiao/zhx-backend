module.exports = () => {
  const config = {};

  config.baseUrl = 'http://localhost:7001';

  config.logger = {
    consoleLevel: 'DEBUG',
  };

  return config;
};
