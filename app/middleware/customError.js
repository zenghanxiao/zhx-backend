module.exports = function() {
  return async function(ctx, next) {
    try {
      await next();
    } catch (e) {
      const error = e;
      if (error && error.status === 401) {
        return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
      } else if (ctx.path === '/api/utils/upload-img') {
        if (error && error.status === 400) {
          return ctx.helper.error({ ctx, errorType: 'imageUploadFileFormatError', error: error.message });
        }
        throw error;
      }
      throw error;
    }
  };
};
