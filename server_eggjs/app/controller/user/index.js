'use strict';

const Controller = require('../../core/base_controller');

/**
 * 学习egg.js的 UserController
 *
 * @class UserController
 * @extends {Controller}
 */
class UserController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset)
    };
    ctx.body = await ctx.model.User.findAll(query);
  }
  
}

module.exports = UserController;
