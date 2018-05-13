'use strict';
module.exports = (sequelize, DataTypes) => {
	var BookContent = sequelize.define(
		'bookContent',
		{
			path: DataTypes.STRING,
			pageIndex: DataTypes.INTEGER,
			extension: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			deletedAt: DataTypes.DATE,
		},
		{}
	);
	BookContent.associate = function(models) {
		BookContent.belongsTo(models.book);
	};
	return BookContent;
};
