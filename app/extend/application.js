const axios = require('axios');
const $OpenApi = require('@alicloud/openapi-client');
const Dysmsapi = require('@alicloud/dysmsapi20170525');

const AXIOS = Symbol('Application#axios');
const ALCLIENT = Symbol('Application#ALClient');

module.exports = {
  echo(msg) {
    const that = this;
    return `hello${msg}${that.config.name}`;
  },
  get axiosInstance() {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 10000,
      });
    }
    return this[AXIOS];
  },
  get ALClient() {
    const that = this;
    console.log(that.config.aliCloudConfig);
    const { accessKeyId, accessKeySecret, endpoint } = that.config.aliCloudConfig;
    if (!this[ALCLIENT]) {
      const config = new $OpenApi.Config({
        accessKeyId,
        accessKeySecret,
      });
      config.endpoint = endpoint;
      this[ALCLIENT] = new Dysmsapi(config);
    }
    return this[ALCLIENT];
  },
};
