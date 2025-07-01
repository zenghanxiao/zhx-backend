module.exports = function(rules, errorType) {
  return function(prototype, key, descriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(...args) {
      const that = this;
      const { ctx, app } = that;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ ctx, errorType, error: errors });
      }
      await originMethod.apply(this, args);
    };
  };
};
