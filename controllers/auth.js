const passport = require('passport');

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

const signout = (req, res, next) => {
	req.session.destroy((err) => {
		return err ? next(err) : res.status(200).send({ success: true });
	});
};

module.exports = {
	signin,
	signup,
	signout
};
