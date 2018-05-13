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
		isFavourite: DataTypes.BOOLEAN,
		thumbnail: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	});

	Book.associate = function(models) {
		Book.belongsTo(models.user);
	};

	Book.getUserBooks = (id) => {
		return Book.findAll({
			attributes: [
				'id',
				'name',
				'description',
				'directory',
				'thumbnail',
				'isFavourite',
			],
			where: {
				userId: id,
				deletedAt: null,
			},
			raw: true,
		});
	};

	Book.toggleFavourite = (userId, bookId) => {
		return Book.findOne({
			where: {
				id: bookId,
				userId: userId,
			},
		}).then((book) => {
			const isFavourite = book.isFavourite;
			const toggleValue = !isFavourite;
			return book.update({
				isFavourite: toggleValue,
			});
		});
	};

	Book.deleteBook = (userId, bookId) => {
		return Book.findOne({
			where: {
				id: bookId,
				userId: userId,
			},
		}).then((book) => {
			return book.update({
				deletedAt: Date.now(),
			});
		});
	};
	return Book;
};
