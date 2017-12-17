const passport = require('passport');

const signup = (req, res, next) => {
	passport.authenticate('local-signup', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(500).send(info);
		}
		res.status(200).send({ success: true });
	})(req, res, next);
};

const signin = (req, res, next) => {
	passport.authenticate('local-signin', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(500).send(info);
		}
		req.session.save((err) => {
			if (err) {
				return next(err);
			}
			res.status(200).send({ success: true, data: {user: user} });
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
