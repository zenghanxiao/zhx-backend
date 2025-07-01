const { Controller } = require('egg');
// const inputValidate = require('../decorator/inputValidate');

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

class UserController extends Controller {
  validatUserInput() {
    const { ctx, app } = this;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    return errors;
  }

  // @inputValidate(userCreateRules, 'loginValidateFail')
  async createByEmail() {
    const { ctx, service } = this;
    // ctx.validate(userCreateRules);
    const errors = this.validatUserInput();
    if (errors) {
      return ctx.helper.error({ ctx, error: errors, errorType: 'loginValidateFail' });
    }

    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }

    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  async loginByEmail() {
    const { ctx, service } = this;
    const errors = this.validatUserInput();
    if (errors) {
      return ctx.helper.error({ ctx, error: errors, errorType: 'loginValidateFail' });
    }

    const { username, password } = ctx.request.body;

    const user = await service.user.findByUsername(username);
    // 检查用户是否存在
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    const verifyPwd = await ctx.compare(password, user.password);
    // 验证密码是否成功
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    ctx.helper.success({ ctx, res: user, msg: '登录成功' });
  }

  async show() {
    const { ctx, service } = this;
    const userData = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: userData });
  }
}

module.exports = UserController;
