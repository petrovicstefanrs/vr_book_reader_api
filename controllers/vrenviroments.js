const VrEnviroments = require('../models').vrEnviroment;

const getEnviroments = (req, res, next) => {
	return VrEnviroments.getAllEnviroments()
		.then((enviroment) => {
			res.status(200).send(enviroment);
		})
		.catch((err) => {
			return next(err);
		});
};

const getEnviromentById = (req, res, next) => {
	const { envId } = req.params;

	return VrEnviroments.getEnviromentById(envId)
		.then((enviroment) => {
			res.status(200).send(enviroment);
		})
		.catch((err) => {
			return next(err);
		});
};

module.exports = {
	getEnviroments,
	getEnviromentById,
};
