const passport 			= require('passport');
const jwt 				= require('jsonwebtoken');
const tokens 			= require('../config/tokens');
const User 				= require('../models').user;

const signup = (req, res, next) => {
	passport.authenticate('local-signup', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).send(info);
		}
		res.status(200).send({ success: true });
	})(req, res, next);
};

const signin = (req, res, next) => {
	passport.authenticate('local-signin', (err, token, data) => {
		if (err) {
			return next(err);
		}

		req.session.save((err) => {
			if (err) {
				return next(err);
			}
			res.status(200).json({
				success: true,
				message: 'You have successfully logged in!',
				token,
				user: data
    		});
		});
	})(req, res, next);
};

const signintoken = (req, res, next) => {
	let token = req.body.token || null;

	if(!token) {
		return res.status(401).send("Invalid user token!");
	}

	return jwt.verify(token, tokens.jwtToken, (err, decoded) => {
		if (err) {
			return res.status(401).send("Token could not be decoded!");
		}

		const userId = decoded.sub;
		return User
			.findById(userId)
			.then((user) => {
				if (!user) {
					return res.status(401).send("Invalid user token!");
				}

				const userInfo = user.get();

				const data = {
					name: userInfo.username,
					email: userInfo.email
				};

      			res.status(200).json({
					success: true,
					message: 'You have successfully logged in!',
					token,
					user: data
	    		});
			})
			.catch((err) => {
				return res.status(401).send("Invalid user token!");
			});
	});
};

const signout = (req, res, next) => {
	req.session.destroy((err) => {
		return err ? next(err) : res.status(200).send({ success: true });
	});
};

module.exports = {
	signin,
	signintoken,
	signup,
	signout
};
