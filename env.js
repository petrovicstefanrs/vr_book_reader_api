const libPath = require('path');

const ENV = {
	NODE_ENV: process.env.NODE_ENV,
	PUBLIC_URL: process.env.PUBLIC_URL,
	PORT: process.env.PORT || '8090',
	STATIC_DIR: 'uploads',
	BOOKS_DIR: 'books',
	THUMBNAIL_DIR: 'thumbnails',
	SOUNDS_DIR: 'sounds',
	MODELS_DIR: 'models',
	ENVIROMENTS_DIR: 'enviroments',
	AVATARS_DIR: 'avatars',
	THEMES_DIR: 'themes',
	ROOT: libPath.resolve(__dirname, './')
};

module.exports = ENV;
