
const router 	        = require('express').Router();

// Import routes
const auth 		        = require('./auth');
const users 	        = require('./users');
const books 	        = require('./books');
const vrenviroments 	= require('./vrenviroments');
const uithemes      	= require('./uithemes');

// Define all routes as middleware and export them

router.get('/health-check', (req, res) => res.send('Health Check: OK!'));
router.use('/auth', auth);
router.use('/api', users);
router.use('/api', books);
router.use('/api', vrenviroments);
router.use('/api', uithemes);

module.exports = router;