const libPath = require('path');

const ENV = {
	NODE_ENV: process.env.NODE_ENV,
	PUBLIC_URL: process.env.PUBLIC_URL,
	PORT: process.env.PORT || '8090',
	BOOKS_DIR: 'uploads/books',
	THUMBNAIL_DIR: 'uploads/thumbnails',
	SOUNDS_DIR: 'uploads/sounds',
	MODELS_DIR: 'uploads/models',
	ROOT: libPath.resolve(__dirname, './')
};

module.exports = ENV;
