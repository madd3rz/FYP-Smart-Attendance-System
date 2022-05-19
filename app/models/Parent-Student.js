const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Parent_Student = sequelize.define('Parent_Student', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ParentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    StudentID: {
        allowNull: false,
        type: Sequelize.INTEGER,
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

module.exports = Parent_Student;