'use strict';
const bCrypt = require('bcrypt-nodejs');

const generateHash = (password) => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

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
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});

	User.getUser = (userId) => {
		return User.findOne({
			attributes: [
				'id',
				'username',
				'email',
				'firstname',
				'lastname',
				'avatar',
				'uiThemeId',
			],
			where: {
				id: userId,
				status: 'active',
			},
		});
	};

	User.updateUserAvatar = (avatar, userId) => {
		return sequelize.transaction((t) => {
			return User.update(
				{ avatar: avatar },
				{
					where: {
						id: userId,
					},
				},
				{ transaction: t }
			);
		});
	};

	User.updateProfileDetails = (payload, userId) => {
		const { lastname, firstname, email } = payload;
		return sequelize.transaction((t) => {
			return User.update(
				{
					lastname: lastname,
					firstname: firstname,
					email: email,
				},
				{
					where: {
						id: userId,
					},
				},
				{ transaction: t }
			);
		});
	};

	User.updateProfilePassword = (password, userId) => {
		const newPassword = generateHash(password);
		return sequelize.transaction((t) => {
			return User.update(
				{
					password: newPassword,
				},
				{
					where: {
						id: userId,
					},
				},
				{ transaction: t }
			);
		});
	};

	User.updateUiTheme = (themeId, userId) => {
		return sequelize.transaction((t) => {
			return User.update(
				{
					uiThemeId: themeId,
				},
				{
					where: {
						id: userId,
					},
				},
				{ transaction: t }
			);
		});
	};

	User.updateProfileDeactivate = (userId) => {
		return sequelize.transaction((t) => {
			return User.update(
				{
					status: 'inactive',
				},
				{
					where: {
						id: userId,
					},
				},
				{ transaction: t }
			);
		});
	};

	return User;
};
