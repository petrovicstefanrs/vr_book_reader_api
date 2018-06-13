const router = require('express').Router();
const controller = require('../controllers/users');
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({
	storage: storage,
	limits: { fieldSize: 50 * 1024 * 1024 },
	preservePath: true,
});

router.get('/users/me', (req, res, next) => {
	controller.getUser(req, res, next);
});

router.put('/users/me/details', (req, res, next) => {
	controller.updateProfileDetails(req, res, next);
});

router.put('/users/me/uitheme', (req, res, next) => {
	controller.updateProfileTheme(req, res, next);
});

router.put('/users/me/deactivate', (req, res, next) => {
	controller.updateProfileDeactivate(req, res, next);
});

router.post('/users/upload/avatar', upload.any(), (req, res, next) => {
	controller.updateUserAvatar(req, res, next);
});

router.post('/users/me/changepass', (req, res, next) => {
	controller.updateProfilePassword(req, res, next);
});

module.exports = router;
