'use strict';

module.exports = app => {
  const { STRING, BIGINT, DATE, UUIDV1, ENUM, INTEGER } = app.Sequelize;

  return {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: STRING(30),
    age: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  };
};
