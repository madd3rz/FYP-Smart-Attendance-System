const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const LoginUser = require('../models/LoginUser')

const Session = sequelize.define("sessions", {
	sid: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	expires: DataTypes.DATE,
	data: DataTypes.TEXT,
});

LoginUser.hasOne(Session, {
	foreignKey: {
		allowNull: true,
	}
});
Session.belongsTo(LoginUser);

module.exports = Session;