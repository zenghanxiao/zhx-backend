/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/ping', controller.home.index);

  router.prefix('/api');
  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.show);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/genVeriCode', controller.user.sendVeriCode);
};
