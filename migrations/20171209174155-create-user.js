'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
      },
      firstname: {
        type: DataTypes.STRING,
        notEmpty: true
      },
      lastname: {
        type: DataTypes.STRING,
        notEmpty: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      }
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('Users');
  }
};