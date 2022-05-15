const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Admin = sequelize.define('Admin', {
    AdminID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Adminname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      AdminEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  	},
    {
      indexes: [
        {
          unique: true,
          fields: ['AdminEmail']
        }],
    })

module.exports = Admin;