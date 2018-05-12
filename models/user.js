'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
			},
		},
		firstname: {
			type: DataTypes.STRING,
			notEmpty: true,
		},
		lastname: {
			type: DataTypes.STRING,
			notEmpty: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('active', 'inactive'),
			defaultValue: 'active',
		},
	});

	return User;
};
