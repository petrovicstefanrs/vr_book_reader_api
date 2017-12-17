const bCrypt 			= require('bcrypt-nodejs');
const LocalStrategy 	= require('passport-local').Strategy;
const User 				= require('../models').user;

const isValidPassword = (userpass,password) => {
	return bCrypt.compareSync(password, userpass);
};

const generateHash = (password) => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

const local_signin = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password'
	}, (email, password, done) => {
		User
			.findOne({ where : { email: email }})
			.then((user) => {
				if (!user) {
					return done(null, false, { message: 'User doesn\'t exist!' });
				}
				if (!isValidPassword(user.password,password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				const userInfo = user.get();
				return done(null, userInfo, { message: 'Signed In.'});
			})
			.catch((err) => {
				return done(null, false, { message: 'Something went wrong with your Signin' });
			});
	}
);

const local_signup = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, (req, email, password, done) => {
		User
			.findOne({ where: { email: email }})
			.then((user) => {
				if (user) {
					return done(null, false, { message : 'That email is already taken' });
				}
				else {
					let userPassword = generateHash(password);


					let data = {
						email: email,
						password: userPassword,
						username: req.body.username,
						firstname: req.body.firstname,
						lastname: req.body.lastname
					};

					User
						.create(data).then((newUser,created) => {
							if (!newUser) {
								return done(null,false);
							}
							if (newUser) {
								return done(null,newUser);
							}
						})
						.catch((err) => {
							return done(null, false, {message: 'Something went wrong with creating your account.' });
						});
				}
			});
	}
);

const serializeUser = (user, done) => {
    done(null, user.id);
};

const deserializeUser = (id, done) => {
	User
		.findById(id)
		.then((user) => {
			if (user) {
			 	done(null, user.get());
			}
			else {
			 	done(user.errors,null);
			}
		});
};

// const validateSignupData = (data) => {
// 	if (true) {}
// }

module.exports = {
	// Sign in strategy
	local_signin,

	// Sign up strategy
	local_signup,

	serializeUser,
	deserializeUser
};
