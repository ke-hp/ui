const debug = require('debug')('ui:macGroup');

// lib
const validator = require('Validator');
const mongo = require(`${__base }mongo`);
const filter = require(`${__base }method/filter`);

async function create(req, res, next) {
	debug('Enter create method!');
	const rules = {
		name: 'string|required',
		macs: 'string|required',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await mongo.macGroup.create(input);

		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}
}

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

	let query;
	if (input.name) {
		const reg = new RegExp(input.name, 'i');
		query = {
			name: {
				$regex: reg,
			},
		}
	}
	try {
		const result = await mongo.macGroup.find(query, {
		}, {
			limit: 10,
			skip: 10 * input.skip,
			sort: {
				_id: 'desc',
			},
		});
		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}
}

async function update(req, res, next) {
	debug('Enter update method!');
	const rules = {
		name: 'string|required',
		macs: 'string|required',
	};
	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await mongo.macGroup.findByIdAndUpdate(req.params.id, input, {
			new: true,
		});

		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}
}

async function destroy(req, res, next) {
	debug('Enter destroy method!');
	try {
		await mongo.macGroup.findByIdAndRemove(req.params.id);
		return res.json({
			status: true,
		})
	} catch (err) {
		return next(err);
	}
}

async function show(req, res, next) {
	debug('Enter show method!');
	const rules = {
		name: 'string',
		type: 'string',
	};
	const input = filter(req.query, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	let groupQuery;
	if (input.name) {
		const reg = new RegExp(input.name, 'i');
		groupQuery = {
			name: {
				$regex: reg,
			},
		}
	}
	try {
		const macGroup = await mongo.macGroup.findOne(groupQuery);

		let macs = macGroup.macs.split(',');

		let sysQuery = {
			timestamp: {
				$gte: Math.floor(Date.now() / 1000) - 300,
				$lte: Math.floor(Date.now() / 1000),
			},
			mac: {
				$in: macs,
			},
			topic: input.type,
		};

		if (input.type === 'traffic') {
			sysQuery.timestamp = {
				$gte: Math.floor(new Date().setHours(0, 0, 0) / 1000),
				$lte: Math.floor(Date.now() / 1000),
			};
		}

		const result = await mongo.sysInfo.find(sysQuery).sort({
			timestamp: -1,
		});
		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	show,
	index,
	create,
	update,
	destroy,
}