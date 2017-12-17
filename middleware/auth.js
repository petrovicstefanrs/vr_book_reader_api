module.exports = {
	is_logged_in: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.status(500).send({ success: false, message: 'Unauthorized!' });
		}
	}
};
