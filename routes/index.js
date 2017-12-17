
const router 	= require('express').Router();

// Import routes
const auth 		= require('./auth');
const users 	= require('./users');

const FORBIDEN_ROUTES = '/api/v1';

// Define all routes as middleware and export them

router.get('/health-check', (req, res) => res.send('Health Check: OK!'));
router.use('/auth', auth);
router.use(FORBIDEN_ROUTES, users);

module.exports = router;