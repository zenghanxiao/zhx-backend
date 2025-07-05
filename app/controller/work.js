const { Controller } = require('egg');

const workCreateRules = {
  title: 'string',
};
// const channelCreateRules = {
//   name: 'string',
//   workId: 'number',
// };
class WorkController extends Controller {
  validatUserInput(rules) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rules, ctx.request.body);
    return errors;
  }

  async createWork() {
    const { ctx, service } = this;

    const errors = this.validatUserInput(workCreateRules);
    if (errors) {
      return ctx.helper.error({ ctx, error: errors, errorType: 'workValidateFail' });
    }

    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
  async copyWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const res = await ctx.service.work.copyWork(parseInt(id));
      ctx.helper.success({ ctx, res });
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'workNoPublicFail' });
    }
  }
  async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findConditon = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: findConditon,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }
  async templateList() {
    const { ctx } = this;
    const { pageIndex, pageSize } = ctx.query;
    const listCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: { isPublic: true, isTemplate: true },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body;
    const res = await this.ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await this.ctx.model.Work.findOneAndDelete({ id }).select('_id id title').lean();
    ctx.helper.success({ ctx, res });
  }
  // @checkPermission('Work', 'workNoPermissonFail', { action: 'publish' })
  async publish(isTemplate) {
    const { ctx } = this;
    const url = await this.service.work.publish(ctx.params.id, isTemplate);
    ctx.helper.success({ ctx, res: { url } });
  }
  async publishWork() {
    await this.publish(false);
  }
  async publishTemplate() {
    await this.publish(true);
  }
}

module.exports = WorkController;
