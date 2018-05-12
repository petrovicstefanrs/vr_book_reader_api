const router = require('express').Router();
const controller = require('../controllers/books');

router.get('/books', (req, res, next) => {
	controller.getBooks(req, res, next);
});

module.exports = router;