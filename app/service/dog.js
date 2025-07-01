const { Service } = require('egg');

class DogService extends Service {
  async show() {
    const resp = await this.ctx.curl('https://dog.ceo/api/breeds/image/random', {
      dataType: 'json',
    });
    return resp.data;
  }

  async showPlayers() {
    const result = await this.ctx.model.User.find({ age: { $gt: 30 } });
    console.log('123', result);
    return result;
  }
}

module.exports = DogService;
