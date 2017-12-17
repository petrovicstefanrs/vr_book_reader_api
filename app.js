const express 		        = require('express');
const passport    	      = require('passport');
const session     	      = require('express-session');
const bodyParser  	      = require('body-parser');
const morgan 		          = require('morgan');
const log                 = require('loglevel');
// const path 			      = require('path');
const cookieParser        = require('cookie-parser');

const routes              = require('./routes');
const models              = require('./models');
const authMiddleware      = require('./middleware/auth');
const passportStrategies  = require('./config/passport');

const FORBIDEN_ROUTES = '/api/v1';

// Initialize Express server
var app = express();

// Use logger middleware
app.use(morgan('dev'));

// Use bodyParser middleware to extract request body and expose it as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Initialize Passport and add Passport & Express sessions as middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

// Import all routes as middleware
app.use(FORBIDEN_ROUTES, authMiddleware.is_logged_in);
app.use('/', routes);

passport.use('local-signin', passportStrategies.local_signin);
passport.use('local-signup', passportStrategies.local_signup);
passport.serializeUser(passportStrategies.serializeUser);
passport.deserializeUser(passportStrategies.deserializeUser);

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

  res.status(err.status || 500);
  res.send({err: err, message: err.message, status: err.status});
});

module.exports = app;