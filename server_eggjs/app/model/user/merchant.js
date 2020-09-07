'use strict';

module.exports = app => {
  const { Sequelize, model, getSortInfo, checkUpdate } = app;
  const { Op } = Sequelize;
  const merchantSchema = require('../../schema/merchant.js')(app);
  const Merchant = model.define('merchant', merchantSchema);

  /**
   * 新增商家
   * @param {object} merchant - 条件
   * @return {string} - 商家uuid
   */
  Merchant.saveNew = async merchant => {
    await Merchant.create(merchant);
    // 返回了uuid;
    return merchant.uuid;
  };

  /**
   * 修改商家
   * @param {object} merchant - 条件
   * @return {string} - 商家uuid
   */
  Merchant.saveModify = async merchant => {
    const {
      uuid, name, enableStatus, servicePhone, linkPhone, appId, appSecret, mchId,
      mchKey, linkMan, address, version, password, lastModifierId, lastModifierName,
    } = merchant;
    const updateField = {
      version, name, enableStatus, servicePhone, appId, appSecret, mchId,
      mchKey, linkPhone, linkMan, address, lastModifierId, lastModifierName,
    };

    if (password) {
      updateField.password = password;
    }

    // 更新
    const result = await Merchant.update(updateField, { where: { uuid, version } });

    checkUpdate(result);

    return uuid;
  };

  /**
   * 修改商家密码
   * @param {object} params - 条件
   * @return {string} - 商家uuid
   */
  Merchant.savePasswordModify = async params => {
    const { uuid, oldPassword, password, lastModifierId, lastModifierName } = params;
    const result = await Merchant.update({ password, lastModifierId, lastModifierName }, {
      where: {
        uuid,
        password: oldPassword,
      },
    });

    // 返回的是一个数组
    checkUpdate(result, '旧密码不正确');

    return uuid;
  };

  /**
   * 查询商家分页列表
   * @param {object} { attributes, pagination, filter } - 条件
   * @return {object|null} - 查找结果
   */
  Merchant.query = async ({ attributes, pagination = {}, filter = {}, sort = [] }) => {
    const { page, pageSize: limit } = pagination;
    const { keywordsLike, status } = filter;
    const order = getSortInfo(sort);
    // 查询条件
    const condition = {
      offset: (page - 1) * limit,
      // 分页大小
      limit,
      // 排序
      order,
      attributes,
      where: {},
    };

    if (status) {
      condition.where.enableStatus = status;
    }

    // 模糊查询
    if (keywordsLike) {
      condition.where[Op.or] = [
        { userName: { [Op.like]: `%%${keywordsLike}%%` } },
        { name: { [Op.like]: `%%${keywordsLike}%%` } },
        { linkMan: { [Op.like]: `%%${keywordsLike}%%` } },
        { linkPhone: { [Op.like]: `%%${keywordsLike}%%` } },
        { servicePhone: { [Op.like]: `%%${keywordsLike}%%` } },
      ];
    }
    // const condition = {
    //   offset: 0,
    //   limit: 10,
    //   order: [['createdTime', 'DESC']],
    //   attributes: [
    //     'uuid',
    //     'version',
    //     'createdTime',
    //     'name',
    //     'enableStatus',
    //     'userName',
    //     'servicePhone',
    //     'linkPhone',
    //     'linkMan'
    //   ],
    //   where: {}
    // }
    const { count, rows } = await Merchant.findAndCountAll(condition);
    return { page, count, rows };
  };

  /**
   * 根据uuid获取商家
   * @param {object} { pagination, filter } - 条件
   * @return {object|null} - 查找结果
   */
  Merchant.get = async ({ uuid, attributes }) => {
    return await Merchant.findByPk(uuid, {
      attributes,
    });
  };

  return Merchant;
};

