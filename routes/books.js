const router = require('express').Router();
const controller = require('../controllers/books');
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({
	storage: storage,
	limits: { fieldSize: 50 * 1024 * 1024 },
	preservePath: true,
});

router.get('/books', (req, res, next) => {
	controller.getBooks(req, res, next);
});

router.get('/books/:bookId', (req, res, next) => {
	controller.getBookById(req, res, next);
});

router.put('/books/favourite', (req, res, next) => {
	controller.toggleFavuoriteBook(req, res, next);
});

router.put('/books/details', (req, res, next) => {
	controller.updateBookDetails(req, res, next);
});

router.delete('/books/delete', (req, res, next) => {
	controller.deleteBook(req, res, next);
});

router.post('/books/upload', upload.any(), (req, res, next) => {
	controller.uploadBook(req, res, next);
});

router.post('/books/upload/thumbnail', upload.any(), (req, res, next) => {
	controller.updateBookThumbnail(req, res, next);
});


module.exports = router;
