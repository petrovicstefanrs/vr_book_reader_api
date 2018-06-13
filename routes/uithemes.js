const router = require('express').Router();
const controller = require('../controllers/uithemes');

router.get('/themes', (req, res, next) => {
	controller.getThemes(req, res, next);
});

module.exports = router;
