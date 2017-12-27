const router = require('express').Router();
const controller = require('../controllers/auth');

router.post('/signup', (req, res, next) => {
	controller.signup(req, res, next);
});
router.post('/signin', (req, res, next) => {
	controller.signin(req,res,next);
});
router.post('/signintoken', (req, res, next) => {
	controller.signintoken(req,res,next);
});
router.post('/signout', (req, res, next) => {
	controller.signout(req, res, next);
});

module.exports = router;