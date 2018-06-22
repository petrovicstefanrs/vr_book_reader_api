const libPath = require('path');
const libFsExtra = require('fs-extra');
const libFs = require('fs');
const decompress = require('decompress');
const unrar = require('node-unrar-js');
const uuid4 = require('uuid/v4');
const lodash = require('lodash');

const ENV = require('../env');
const Books = require('../models').book;
const BookContent = require('../models').bookContent;

const getBooks = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;

	return Books.getUserBooks(userId)
		.then((data) => {
			const payload = lodash.map(data, (book) => {
				return extractBookFromRecord(book);
			});
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const getBookById = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { bookId } = req.params;

	return Books.getBookById(userId, bookId)
		.then((book) => {
			const payload = extractBookFromRecord(book);
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const toggleFavuoriteBook = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { bookId } = req.body;

	return Books.toggleFavourite(userId, bookId)
		.then((book) => {
			const payload = book.dataValues;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const deleteBook = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { bookId } = req.body;

	return Books.deleteBook(userId, bookId)
		.then((book) => {
			const payload = book.dataValues;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateBookDetails = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { bookId, name, description } = req.body;
	const data = {
		name,
		description,
	};

	return Books.updateDetails(data, bookId)
		.then(() => {
			return Books.getBookById(userId, bookId);
		})
		.then((book) => {
			const payload = book;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const uploadBook = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const book = req.files && req.files[0];

	if (!book) {
		const err = new Error(`Uploading book has failed.`);
		return next(err);
	}

	const targetFolderPath = ENV.BOOKS_DIR + '/' + uuid4() + '/';
	const tmpBookPath = book.path || null;

	return unpackBook(book, targetFolderPath)
		.then((files) => {
			const thumbnailPath = libPath.join(targetFolderPath, files[0].path);
			const bookPayload = {
				name: book.originalname,
				directory: targetFolderPath,
				thumbnail: thumbnailPath,
				userId,
			};
			let pageIndex = 0;
			const pagesPayload = lodash.map(files, (file) => {
				const fileExtention = libPath.extname(file.path);
				const data = {
					path: libPath.join(targetFolderPath, file.path),
					pageIndex,
					extension: fileExtention,
				};
				pageIndex++;
				return data;
			});

			return Books.createBook(bookPayload, pagesPayload);
		})
		.then((res) => {
			if (!res || !res.length) {
				const err = new Error(
					`Writing book: ${book.originalname ||
						'Unknown'} to database failed.`
				);
				reject(err);
			}
			const bookId = res[0].bookId;
			return Books.getBookById(userId, bookId);
		})
		.then((book) => {
			const payload = book;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateBookThumbnail = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const thumbnail = req.files && req.files[0];
	const bookId = req.body.bookId;

	if (!thumbnail) {
		const err = new Error(`Uploading thumbnail has failed.`);
		return next(err);
	}

	const oldPath = thumbnail.path || null;
	const fileExtention = libPath.extname(thumbnail.originalname);
	const targetFileName = ENV.THUMBNAIL_DIR + '/' + uuid4() + fileExtention;

	const newPath = libPath.resolve(ENV.ROOT, ENV.STATIC_DIR, targetFileName);

	libFsExtra
		.move(oldPath, newPath)
		.then(() => {
			return Books.updateThumbnail(targetFileName, bookId);
		})
		.then(() => {
			return Books.getBookById(userId, bookId);
		})
		.then((book) => {
			const payload = book;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

const updateBookEnviroment = (req, res, next) => {
	const { user } = req.principal;
	const userId = user.id;
	const { envId, bookId } = req.body;

	return Books.updateEnviroment(envId, bookId)
		.then(() => {
			return Books.getBookById(userId, bookId);
		})
		.then((book) => {
			const payload = book;
			res.status(200).send(payload);
		})
		.catch((err) => {
			return next(err);
		});
};

// Internal methods ---------------------------------------------------------------

const unpackBook = (book, targetFolderPath) => {
	const p = new Promise((resolve, reject) => {
		const targetDir = libPath.resolve(
			ENV.ROOT,
			ENV.STATIC_DIR,
			targetFolderPath
		);
		const bookMimeType = book.mimetype;
		const bookExt = libPath.extname(book.originalname);
		const tmpBookPath = book.path || null;

		if (!tmpBookPath) {
			const err = new Error(
				`Unable to process book: ${book.originalname || 'Unknown'}.`
			);
			reject(err);
		}
		libFsExtra.ensureDir(targetDir, (err) => {
			if (err) {
				reject(err);
			}

			if (bookExt === '.cbr') {
				const extractor = unrar.createExtractorFromFile(
					tmpBookPath,
					targetDir
				);
				const list = extractor.getFileList();

				if (list[0].state === 'SUCCESS') {
					const data = extractor.extractAll();
					const { files } = data[1];

					let i = 0;
					const payload = lodash.map(files, (file) => {
						const { fileHeader } = file;
						if (!fileHeader) {
							const err = new Error(
								`Unable to process book pages: ${book.originalname ||
									'Unknown'}.`
							);
							reject(err);
						}
						const pageName = libPath.resolve(
							targetDir,
							fileHeader.name
						);
						const pageExt = libPath.extname(fileHeader.name);
						const newPageName = libPath.resolve(
							targetDir,
							`${i}${pageExt}`
						);
						libFs.renameSync(pageName, newPageName);

						const payload = {
							path: `${i}${pageExt}`,
							type: 'file',
						};
						i++;
						return payload;
					});

					return resolve(payload);
				}
			} else if (bookExt === '.cbz') {
				let i = 0;
				decompress(tmpBookPath, targetDir, {
					filter: (file) => {
						return file.type === 'file';
					},
					map: (file) => {
						// Rename decompresed files to a desired format
						const ext = libPath.extname(file.path);
						file.path = `${i}${ext}`;
						i++;
						return file;
					},
				})
					.then((files) => {
						return resolve(files);
					})
					.catch((err) => {
						return reject(err);
					});
			} else {
				const err = new Error(
					`Unsupported book format: ${bookExt || 'Unknown'}.`
				);
				reject(err);
			}
		});
	});
	return p;
};

const extractBookFromRecord = (book) => {
	return Object.assign(
		{},
		{
			id: book.id,
			name: book.name,
			description: book.description,
			directory: book.directory,
			thumbnail: book.thumbnail,
			isFavourite: book.isFavourite,
			createdAt: book.createdAt || null,
			vrEnviromentId: book.vrEnviromentId || null,
			pages: lodash.map(book.bookContents, (page) => {
				return Object.assign(
					{},
					{
						id: page.id,
						path: page.path,
						pageIndex: page.pageIndex,
						extension: page.extension,
					}
				);
			}),
		}
	);
};

module.exports = {
	getBooks,
	getBookById,
	toggleFavuoriteBook,
	deleteBook,
	uploadBook,
	updateBookThumbnail,
	updateBookDetails,
	updateBookEnviroment,
};
