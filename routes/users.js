const router = require('express').Router();
const controller = require('../controllers/users');

router.get('/users', (req, res, next) => {
	res.send('USERS');
});

module.exports = router;