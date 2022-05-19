const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Student = require('../models/Student');

const Parent = sequelize.define('Parent', {
  ParentID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  ParentName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ParentEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

Parent.hasMany(Student, {
  foreignKey: {
    name: 'ParentID',
    allowNull: false,
  }
});
Student.belongsTo(Parent, {
  foreignKey: {
    name: 'ParentID',
    allowNull: false,
  }
});

module.exports = Parent;