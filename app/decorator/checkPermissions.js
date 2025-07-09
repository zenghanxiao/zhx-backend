const defineRoles = require('../roles/roles');
const { subject } = require('@casl/ability');
const { permittedFieldsOf } = require('@casl/ability/extra');
const { difference, assign } = require('lodash/fp');

const caslMethodMapping = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

const fieldsOptions = { fieldsFrom: rule => rule.fields || [] };

const defaultSearchOptions = {
  key: 'id',
  value: { type: 'params', valueKey: 'id' },
};
// { id: ctx.params.id }
// { 'channels.id' : ctx.params.id }
// { 'channels.id' : ctx.request.body.workID }
/**
 *
 * @param modelName model 的名称，可以是普通的字符串，也可以是 casl 和 mongoose 的映射关系
 * @param errorType 返回的错误类型，来自 GlobalErrorTypes
 * @param options 特殊配置选项，可以自定义 action 以及查询条件，详见上面的 IOptions 选项
 * @return function
 */
module.exports = function checkPermissions(modelName, errorType, options) {
  return function(proptype, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
      const { ctx } = this;
      const { method } = ctx.request;
      const searchOptions = assign(defaultSearchOptions, options || {});
      const { key, value } = searchOptions;
      const { type, valueKey } = value;

      // 构建一个 query
      const source = (type === 'params') ? ctx.params : ctx.request.body;
      const query = {
        [key]: source[valueKey],
      };

      // 构建 modelname
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose;
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl;
      const action = (options && options.action) ? options.action : caslMethodMapping[method];

      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }

      let permission = false;
      let keyPermission = true;

      // 获取定义的 roles
      const ability = defineRoles(ctx.state.user);
      // 所以我们需要先获取 rule 来判断一下，看他是否存在对应的条件
      const rule = ability.relevantRuleFor(action, caslModelName);

      if (rule && rule.conditions) {
        // 假如存在 condition，先查询对应的数据
        const certianRecord = await ctx.model[mongooseModelName].findOne(query).lean();
        permission = ability.can(action, subject(caslModelName, certianRecord));
      } else {
        permission = ability.can(action, caslModelName);
      }

      // 判断 rule 中是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, caslModelName, fieldsOptions);
        if (fields.length > 0) {
          // 1 过滤 request.body *
          // 2 获取当前 payload 的 keys 和 允许的 fields 做比较
          // fields 对 payloadKeys 的关系应该是全部包含的关系
          const payloadKeys = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKeys, fields);
          keyPermission = diffKeys.length === 0;
        }
      }

      if (!permission || !keyPermission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originalMethod.apply(this, args);
    };
  };
};
