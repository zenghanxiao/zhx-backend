const axios = require('axios');

const AXIOS = Symbol('Application#axios');

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
};
