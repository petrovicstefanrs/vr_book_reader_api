const libPath = require('path');
const libFsExtra = require('fs-extra');
const uuid4 = require('uuid/v4');
const lodash = require('lodash');

const ENV = require('../env');
const UiThemes = require('../models').uiTheme;

const getThemes = (req, res, next) => {
	return UiThemes.getAllThemes()
		.then((themes) => {
			res.status(200).send(themes);
		})
		.catch((err) => {
			return next(err);
		});
};

module.exports = {
	getThemes,
};
