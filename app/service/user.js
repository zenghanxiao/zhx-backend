const { Service } = require('egg');
const $Dysmsapi = require('@alicloud/dysmsapi20170525');

class UserService extends Service {
  async createByEmail(payload) {
    const { ctx } = this;
    const { username, password } = payload;
    const hash = await ctx.genHash(password);
    const userCreatedData = {
      username,
      password: hash,
      email: username,
    };
    return ctx.model.User.create(userCreatedData);
  }

  async findById(id) {
    return this.ctx.model.User.findById(id);
  }

  async findByUsername(username) {
    return this.ctx.model.User.findOne({ username });
  }

  async sendSMS(phoneNumber, veriCode) {
    const { app } = this;
    // 配置参数
    const sendSMSRequest = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: '慕课乐高',
      templateCode: 'SMS_223580190',
      templateParam: `{\"code\":\"${veriCode}\"}`,
    });
    const resp = await app.ALClient.sendSms(sendSMSRequest);
    return resp;
  }

  async loginByCellphone(cellphone) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    // 检查 user 记录是否存在
    if (user) {
      // generate token
      const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
      return token;
    }
    // 新建一个用户
    const userCreatedData = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    return token;
  }
}

module.exports = UserService;
