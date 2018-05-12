'use strict';
module.exports = (sequelize, DataTypes) => {
	const Book = sequelize.define('book', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		directory: DataTypes.STRING,
		thumbnail: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	});

	Book.associate = function(models) {
		Book.belongsTo(models.user);
	};

	Book.getUserBooks = (id) => {
		return Book.findAll({
			attributes: ['id', 'name', 'description', 'directory', 'thumbnail'],
			where: {
				userId: id
			},
			raw: true
		});
	}
	return Book;
};
