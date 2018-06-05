const router = require('express').Router();
const controller = require('../controllers/vrenviroments');

router.get('/environments', (req, res, next) => {
	controller.getEnviroments(req, res, next);
});

router.get('/environments/:envId', (req, res, next) => {
	controller.getEnviromentById(req, res, next);
});

module.exports = router;
