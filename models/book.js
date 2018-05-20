'use strict';
const lodash = require('lodash');

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
		Book.hasMany(models.bookContent);
	};

	Book.getUserBooks = (userId) => {
		return Book.findAll({
			attributes: [
				'id',
				'name',
				'description',
				'directory',
				'thumbnail',
				'isFavourite',
			],
			include: [{ model: sequelize.models.bookContent }],
			where: {
				userId: userId,
				deletedAt: null,
			},
		});
	};

	Book.getBookById = (userId, bookId) => {
		return Book.findOne({
			attributes: [
				'id',
				'name',
				'description',
				'directory',
				'thumbnail',
				'isFavourite',
			],
			include: [{ model: sequelize.models.bookContent }],
			where: {
				id: bookId,
				userId: userId,
			},
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

	Book.createBook = (book, pages) => {
		return sequelize.transaction((t) => {
			return Book.create(book, { transaction: t }).then((newBook) => {
				const bookId = newBook.id;
				const payload = lodash.map(pages, (page) => {
					page.bookId = bookId;
					return page;
				});
				return sequelize.models.bookContent.writeImages(pages, {
					transaction: t,
				});
			});
		});
	};

	Book.updateThumbnail = (thumbnail, bookId) => {
		return sequelize.transaction((t) => {
			return Book.update(
				{thumbnail: thumbnail},
				{
					where: {
						id: bookId,
					},
				},
				{ transaction: t }
			);
		});
	};
	return Book;
};
