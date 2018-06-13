'use strict';
module.exports = (sequelize, DataTypes) => {
	const UiTheme = sequelize.define('uiTheme', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: DataTypes.STRING,
		thumbnail: DataTypes.STRING,
		primary: DataTypes.STRING,
		secondary: DataTypes.STRING,
		error: DataTypes.STRING,
		success: DataTypes.STRING,
		warning: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	});

	UiTheme.associate = function(models) {
		UiTheme.hasMany(models.user);
	};

	UiTheme.getAllThemes = () => {
		return UiTheme.findAll({
			attributes: [
				'id',
				'name',
				'thumbnail',
				'primary',
				'secondary',
				'error',
				'success',
				'warning',
			],
			where: {
				deletedAt: null,
			},
			raw: true,
		});
	};

	UiTheme.getThemeById = (themeId) => {
		return UiTheme.findOne({
			attributes: [
				'id',
				'name',
				'thumbnail',
				'primary',
				'secondary',
				'error',
				'success',
				'warning',
			],
			where: {
				id: themeId,
				deletedAt: null,
			},
		});
	};

	return UiTheme;
};
