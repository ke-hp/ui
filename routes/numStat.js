const debug = require('debug')('ui:numStat');

// lib
const validator = require('Validator');
const mongo = require(`${__base }mongo`);
const filter = require(`${__base }method/filter`);

async function index(req, res, next) {
	debug('Enter index method!');

	const rules = {
		timeValue: 'array',
	};
	const input = filter(req.query, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}
	try {
		let query = {
			$and: [
				{
					time: {
						$gte: input.timeValue[0],
					},
				}, {
					time: {
						$lte: input.timeValue[1],
					},
				},
			],
		};
        
		const result = await mongo.numStat.find(query, {
		}, {
			sort: {
				time: 'desc',
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