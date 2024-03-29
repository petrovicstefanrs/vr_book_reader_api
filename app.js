const express             = require('express');
const passport            = require('passport');
const session             = require('express-session');
const bodyParser          = require('body-parser');
const morgan              = require('morgan');
const log                 = require('loglevel');
const cors 				  = require('cors')
const libPath 			  = require('path')

const ENV 				  = require('./env');
const routes              = require('./routes');
const models              = require('./models');
const authMiddleware      = require('./middleware/auth');
const passportStrategies  = require('./config/passport');
const tokens              = require('./config/tokens');

// Initialize Express server
var app = express();

// Cross Origin

app.use(cors());

// Use logger middleware
app.use(morgan('dev'));

// Use bodyParser middleware to extract request body and expose it as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport and add Passport & Express sessions as middleware
app.use(session({
	secret: tokens.sessionSecret,
	resave: true,
	saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set static folder
const staticDir = libPath.resolve(ENV.ROOT, ENV.STATIC_DIR);
app.use(express.static(staticDir));

// Import all routes as middleware

// Verify auth on all routes except the ones for auth
app.use('/api', authMiddleware);
app.use('/', routes);

passport.use('local-signin', passportStrategies.local_signin);
passport.use('local-signup', passportStrategies.local_signup);

models.sequelize.authenticate()
	.then(() => {
		log.info('Connection has been established successfully.');
	})
	.catch(err => {
		log.error('Unable to connect to the database:', err);
	});

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	const error = {
		error: err,
		message: err.message,
		status: err.status
	};
	res.status(err.status || 500);
	res.send({error});
});

module.exports = app;