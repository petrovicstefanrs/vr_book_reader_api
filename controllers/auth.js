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
			const error = new Error(info);
			error.status = 401;
			return next(error);
		}
		res.status(200).send({ success: true });
	})(req, res, next);
};

const signin = (req, res, next) => {
	passport.authenticate('local-signin', (err, token, data) => {
		if (err) {
			return next(err);
		}

		if(!token && data) {
			const error = new Error(data.message || "Something went wrong!");
			error.status = 401;
			return next(error);
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
		const error = new Error("Your session has expired!");
		error.status = 401;
		return next(error);
	}

	return jwt.verify(token, tokens.jwtToken, (err, decoded) => {
		if (err) {
			const error = new Error("Your session has expired!");
			error.status = 401;
			return next(error);
		}

		const userId = decoded.sub;
		return User
			.findById(userId)
			.then((user) => {
				if (!user) {
					const error = new Error("Your session has expired!");
					error.status = 401;
					return next(error);
				}

				const userInfo = user.get();

				const data = {
					name: userInfo.username,
					email: userInfo.email
				};

      			res.status(200).json({
					success: true,
					message: 'Authorized!',
					token,
					user: data
	    		});
			})
			.catch((err) => {
				const error = new Error("Your session has expired!");
				err.status = 401;
				return next(error);
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
