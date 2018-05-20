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
		BookContent.belongsTo(models.book, {targetKey: 'id'});
	};

	BookContent.writeImages = (images, transaction = null) => {
		return BookContent.bulkCreate(images, transaction);
	};
	return BookContent;
};
