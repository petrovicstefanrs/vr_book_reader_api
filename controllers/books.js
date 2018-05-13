const Books = require('../models').book;

const getBooks = (req, res, next) => {
    const {user} = req.principal;
    const userId = user.id;

	return Books.getUserBooks(userId)
		.then((books) => {
            const payload = books;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
        });
};

const toggleFavuoriteBook = (req, res, next) => {
    const {user} = req.principal;
    const userId = user.id;
    const {bookId} = req.body;

	return Books.toggleFavourite(userId, bookId)
		.then((book) => {
            const payload = book.dataValues;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
        });
};

const deleteBook = (req, res, next) => {
    const {user} = req.principal;
    const userId = user.id;
    const {bookId} = req.body;

	return Books.deleteBook(userId, bookId)
		.then((book) => {
            const payload = book.dataValues;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
        });
};

module.exports = {
    getBooks,
    toggleFavuoriteBook,
    deleteBook
};
