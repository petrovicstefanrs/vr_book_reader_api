const libPath = require('path');
const libFsExtra = require('fs-extra');
const libFs = require('fs');
const uuid4 = require('uuid/v4');
const lodash = require('lodash');

const ENV = require('../env');
const Users = require('../models').user;
const UiThemes = require('../models').uiTheme;

const getUser = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;

	return Users.getUser(userId)
		.then((user) => {
			const payload = user.dataValues;
			const { avatar } = payload;

			if (avatar) {
				const avatarPath = libPath.resolve(
					ENV.ROOT,
					ENV.STATIC_DIR,
					avatar
				);
				const avatarExists = libFs.existsSync(avatarPath);

				if (!avatarExists) {
					payload.avatar = null;
					Users.updateUserAvatar(null, userId);
				}
			}

			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateUserAvatar = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const avatar = req.files && req.files[0];

	if (!avatar) {
		const err = new Error(`Uploading avatar has failed.`);
		return next(err);
	}

	const oldPath = avatar.path || null;
	const fileExtention = libPath.extname(avatar.originalname);
	const targetFileName = ENV.AVATARS_DIR + '/' + uuid4() + fileExtention;

	const newPath = libPath.resolve(ENV.ROOT, ENV.STATIC_DIR, targetFileName);

	libFsExtra
		.move(oldPath, newPath)
		.then(() => {
			return Users.updateUserAvatar(targetFileName, userId);
		})
		.then(() => {
			return Users.getUser(userId);
		})
		.then((user) => {
			const payload = user;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateProfileDetails = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { lastname, firstname, email } = req.body;
	const data = {
		lastname,
		firstname,
		email,
	};

	return Users.updateProfileDetails(data, userId)
		.then(() => {
			return Users.getUser(userId);
		})
		.then((user) => {
			const payload = user;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateProfilePassword = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { password } = req.body;

	return Users.updateProfilePassword(password, userId)
		.then(() => {
			return Users.getUser(userId);
		})
		.then((user) => {
			const payload = user;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateProfileTheme = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { themeId } = req.body;

	return Users.updateUiTheme(themeId, userId)
		.then(() => {
			return Users.getUser(userId);
		})
		.then((user) => {
			const payload = user;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateProfileDeactivate = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;

	return Users.updateProfileDeactivate(userId)
		.then(() => {
			return Users.getUser(userId);
		})
		.then((user) => {
			const payload = user;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

// Internal methods ---------------------------------------------------------------

module.exports = {
	getUser,
	updateUserAvatar,
	updateProfileDetails,
	updateProfilePassword,
	updateProfileTheme,
	updateProfileDeactivate,
};
