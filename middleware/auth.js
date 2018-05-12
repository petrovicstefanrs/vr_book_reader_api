const jwt 		= require('jsonwebtoken');
const User 		= require('../models').user;
const tokens 	= require('../config/tokens');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).send("No authorization headers present!");
	}

	// get the last part from a authorization header string like "bearer token-value"
	const token = req.headers.authorization.split(' ')[1];

	// decode the token using a secret key-phrase
	return jwt.verify(token, tokens.jwtToken, (err, decoded) => {
		if (err) {
			return res.status(401).send("Token could not be decoded!");
		}

		const userId = decoded.sub;
		// check if a user exists
		return User
			.findById(userId)
			.then((user) => {
				if (!user) {
					return res.status(401).send("Invalid user token!");
				}

				req.principal = {
					user: {
						id: userId
					}
				}
				return next();
			})
			.catch((err) => {
				return res.status(401).send("Invalid user token!");
			});
	});
};