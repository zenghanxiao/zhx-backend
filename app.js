
class AppBoot {
  constructor(app) {
    this.app = app;
    // app.sessionMap = {};
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // this.app.config.coreMiddleware.unshift('myLogger')
  }
  async willReady() {
    console.log('enable willready', this.app.config.coreMiddleware);
    // const dir = join(this.app.config.baseDir, 'app/model')
    // this.app.loader.loadToApp(dir, 'model', {
    //   caseStyle: 'upper'
    // })
    // app/model/user.ts => app.model.User
  }
  async didReady() {
    console.log('middleware', this.app.middleware);
    const ctx = await this.app.createAnonymousContext();
    const res = await ctx.service.test.sayHi('viking');
    console.log(res);
  }
}

module.exports = AppBoot;
