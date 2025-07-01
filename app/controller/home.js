const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.service.dog.showPlayers();
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
