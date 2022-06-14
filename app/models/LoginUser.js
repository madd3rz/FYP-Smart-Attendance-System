const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const LoginUser = sequelize.define('users', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	fullName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	resetToken: {
		type: DataTypes.STRING,
		allowNull: true
	},
	resetTokenExpiry: {
		type: DataTypes.DATE,
		allowNull: true
	}
},
	{
		indexes: [
			// Create a unique index on email
			{
				unique: true,
				fields: ['email']
			}],
	});

LoginUser.hasOne(Parent, {
	foreignKey: {
		allowNull: true,
	}
});
Parent.belongsTo(LoginUser);

LoginUser.hasOne(Teacher, {
	foreignKey: {
		allowNull: false,
	}
});
Teacher.belongsTo(LoginUser);

LoginUser.hasOne(Admin, {
	foreignKey: {
		allowNull: false,
	}
});
Admin.belongsTo(LoginUser);

module.exports = LoginUser;