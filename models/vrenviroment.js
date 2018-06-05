'use strict';
module.exports = (sequelize, DataTypes) => {
	const VrEnviroment = sequelize.define('vrEnviroment', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		thumbnail: DataTypes.STRING,
		enviromentDefinition: DataTypes.JSON,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	});

	VrEnviroment.associate = function(models) {
		VrEnviroment.hasMany(models.book);
	};

	VrEnviroment.getAllEnviroments = () => {
		return VrEnviroment.findAll({
			attributes: [
				'id',
				'name',
				'description',
				'thumbnail',
				'enviromentDefinition',
			],
			where: {
				deletedAt: null,
			},
		});
	};

	VrEnviroment.getEnviromentById = (envId) => {
		return Book.findOne({
			attributes: [
				'id',
				'name',
				'description',
				'thumbnail',
				'enviromentDefinition',
			],
			where: {
				id: envId,
				deletedAt: null,
			},
		});
	};

	return VrEnviroment;
};
