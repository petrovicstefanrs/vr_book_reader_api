const router = require('express').Router();
const controller = require('../controllers/books');

router.get('/books', (req, res, next) => {
	controller.getBooks(req, res, next);
});

router.put('/books/favourite', (req, res, next) => {
	controller.toggleFavuoriteBook(req, res, next);
});

router.delete('/books/delete', (req, res, next) => {
	controller.deleteBook(req, res, next);
});

module.exports = router;