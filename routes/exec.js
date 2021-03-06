const debug = require('debug')('ui:exec');

// lib
const validator = require('Validator');
const mongo = require(`${__base }mongo`);
const filter = require(`${__base }method/filter`);

async function index(req, res, next) {
	debug('Enter index method!');

	const rules = {
		name: 'string',
		skip: 'integer',
	};
	const input = filter(req.query, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	const reg = new RegExp(input.name, 'i');

	try {
		const result = await mongo.exec.find({
			$or: [
				{
					user: {
						$regex: reg,
					},
				}, {
					mac: {
						$regex: reg,
					},
				},
			],
		}, {
		}, {
			limit: 10,
			skip: 10 * input.skip,
			sort: {
				timestamp: 'desc',
			},
		});

		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	index,
}