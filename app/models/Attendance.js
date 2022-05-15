const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Student = require('../models/Student');

const Attendance = sequelize.define('Attendance', {
    recordID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
    },
    checkInDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    tempReading: {
        type: Sequelize.FLOAT(4, 2),
        allowNull: false,
    },
    RFIDcode: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    /* studentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Student',
            key: 'StudentID',
        }

    } */
},
    { timestamps: false, }

);

Student.hasMany(Attendance, {
    foreignKey: {
        name: 'StudentID',
        allowNull: false,
        type: Sequelize.INTEGER,
    }
});
Attendance.belongsTo(Student, {
    foreignKey: {
        name: 'StudentID'
    }
});


module.exports = Attendance;