const bCrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').user;
const tokens = require('./tokens');

const isValidPassword = (userpass, password) => {
	return bCrypt.compareSync(password, userpass);
};

const generateHash = (password) => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

const local_signin = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	(email, password, done) => {
		User.findOne({ where: { email: email } })
			.then((user) => {
				if (!user) {
					const error = new Error();
					error.status = 401;
					error.name = 'IncorrectCredentialsError';
					error.message = "User with that email does't exist.";

					return done(error);
				}
				if (!isValidPassword(user.password, password)) {
					const error = new Error();
					error.status = 401;
					error.name = 'IncorrectCredentialsError';
					error.message = 'Incorrect password.';

					return done(error);
				}
				const userInfo = user.get();

				const payload = {
					sub: userInfo.id,
				};

				// create a token string
				const token = jwt.sign(payload, tokens.jwtToken);
				const data = {
					name: userInfo.username,
					email: userInfo.email,
				};

				return done(null, token, data);
			})
			.catch((err) => {
				const error = new Error();
				error.status = 401;
				error.name = 'AuthError';
				error.message = 'Something went wrong with your Signin.';

				return done(error);
			});
	}
);

const local_signup = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	(req, email, password, done) => {
		User.findOne({ where: { email: email } }).then((user) => {
			if (user) {
				const error = new Error();
				error.status = 401;
				error.name = 'IncorrectCredentialsError';
				error.message = 'Email is already taken.';

				return done(error);
			} else {
				let userPassword = generateHash(password);

				let data = {
					email: email,
					password: userPassword,
					username: req.body.username,
					firstname: req.body.firstname,
					lastname: req.body.lastname,
				};

				User.create(data)
					.then((newUser, created) => {
						if (!newUser) {
							return done(null, false);
						}
						if (newUser) {
							return done(null, newUser);
						}
					})
					.catch((err) => {
						const error = new Error();
						error.status = 401;
						error.name = 'AuthError';
						error.message =
							'Something went wrong while creating your account.';

						return done(error);
					});
			}
		});
	}
);

// const serializeUser = (user, done) => {
// 	console.log("SERIALIZACIJA",user);
//     done(null, user.id);
// };

// const deserializeUser = (id, done) => {
// 	console.log("DESERIALIZACIJA",id);
// 	User
// 		.findById(id)
// 		.then((user) => {
// 			if (user) {
// 			 	done(null, user.get());
// 			}
// 			else {
// 			 	done(user.errors,null);
// 			}
// 		});
// };

// const validateSignupData = (data) => {
// 	if (true) {}
// }

module.exports = {
	// Sign in strategy
	local_signin,

	// Sign up strategy
	local_signup,

	// serializeUser,
	// deserializeUser
};
