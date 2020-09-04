'use strict';

module.exports = app => {
  // 传入模型定义
  const { model } = app;
  const userSchema = require('../../schema/user.js')(app);
  const User = model.define('user', userSchema);

  return User;
}