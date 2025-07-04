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

  // get access token
  async getAccessToken(code) {
    const { ctx, app } = this;
    const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret,
      },
    });
    app.logger.info(data);
    return data.access_token;
  }
  // get gitee user data
  async getGiteeUserData(access_token) {
    const { ctx, app } = this;
    const { giteeUserAPI } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl(`${giteeUserAPI}?access_token=${access_token}`, {
      dataType: 'json',
    });
    return data;
  }
  async loginByGitee(code) {
    const { ctx, app } = this;
    // 获取 access_token
    const accessToken = await this.getAccessToken(code);
    // 获取用户的信息
    const user = await this.getGiteeUserData(accessToken);
    // 检查用户信息是否存在
    const { id, name, avatar_url, email } = user;
    const stringId = id.toString();
    // Gitee + id
    // Github + id
    // WX + id
    // 假如已经存在
    const existUser = await this.findByUsername(`Gitee${stringId}`);
    if (existUser) {
      const token = app.jwt.sign({ username: existUser.username, _id: existUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
      return token;
    }
    // 假如不存在，新建用户
    const userCreatedData = {
      oauthID: stringId,
      provider: 'gitee',
      username: `Gitee${stringId}`,
      picture: avatar_url,
      nickName: name,
      email,
      type: 'oauth',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    return token;
  }
}

module.exports = UserService;
