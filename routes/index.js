
const router 	= require('express').Router();

// Import routes
const auth 		= require('./auth');
const users 	= require('./users');

// Define all routes as middleware and export them

router.get('/health-check', (req, res) => res.send('Health Check: OK!'));
router.use('/auth', auth);
router.use('/api', users);

module.exports = router;