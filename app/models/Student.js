const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Student = sequelize.define('Student', {
    StudentID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
      },
      StudentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      StudentClass: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      StudentEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      RFIDcode: {
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
  	}    
    );

module.exports = Student;