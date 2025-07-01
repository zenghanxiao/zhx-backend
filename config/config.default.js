/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1750919662912_5990';

  // add your middleware config here
  config.middleware = [ 'myLogger' ];

  config.security = {
    csrf: {
      enable: false,
    },
    // domainWhiteList: 'http://localhost:8080',
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/lego?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.1',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    myLogger: {
      allowedMethod: [ 'POST' ],
    },
    baseUrl: 'default.url',
  };

  return {
    ...config,
    ...userConfig,
  };
};
