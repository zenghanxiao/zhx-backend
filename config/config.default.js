/* eslint valid-jsdoc: "off" */

const { join } = require('path');
const dotenv = require('dotenv');
dotenv.config();

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
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
    // domainWhiteList: 'http://localhost:8080',
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/lego?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.1',
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.jwt = {
    enable: true,
    secret: 'xx11xx11xx', // process.env.JWT_SECRET || '',
    match: [ '/api/users/getUserInfo', '/api/works', '/api/utils/upload-img', '/api/channel' ],
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.multipart = {
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '1mb',
  };

  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') },
    ],
  };

  // config.cors = {
  //   origin: 'http://localhost:8080',
  //   allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH'
  // }

  config.oss = {
    client: {
      accessKeyId: 'xx', // process.env.ALC_ACCESS_KEY || '',
      accessKeySecret: 'xx', // process.env.ALC_SECRET_KEY || '',
      bucket: 'lego-backend',
      endpoint: 'oss-cn-shanghai.aliyuncs.com',
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    myLogger: {
      allowedMethod: [ 'POST' ],
    },
    baseUrl: 'default.url',
    jwtExpires: '1h',
    aliCloudConfig: {
      accessKeyId: 'xx', // process.env.ALC_ACCESS_KEY,
      accessKeySecret: 'xx', // process.env.ALC_SECRET_KEY,
      endpoint: 'dysmsapi.aliyuncs.com',
    },
    giteeOauthConfig: {
      cid: 'xx', // process.env.GITEE_CID,
      secret: 'xx', // process.env.GITEE_SECRET,
      redirectURL: 'http://localhost:7001/api/users/passport/gitee/callback',
      authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
      giteeUserAPI: 'https://gitee.com/api/v5/user',
    },
    H5BaseURL: 'http://localhost:7001/api/pages',
  };

  return {
    ...config,
    ...userConfig,
  };
};
