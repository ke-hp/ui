const debug = require('debug')('ui:mac');

// lib
const validator = require('Validator');
const mongo = require(`${__base}mongo`);
const filter = require(`${__base}method/filter`);

async function create(req, res, next) {
	debug('Enter create method!');

	const rules = {
		company: 'string|required',
		mac: 'string|required',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await mongo.mac.create(input);

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
		agent: 'string',
	};
	const input = filter(req.query, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	let query = {
	};
	if ("privileges" in res.locals.user && res.locals.user.privileges === "agent") {
		query.agent = res.locals.user._id;
	}

	if (input.agent) {
		query.agent = input.agent;
	}

	if (input.name) {
		const reg = new RegExp(input.name, 'i');
		query.$or = [
			{
				company: {
					$regex: reg,
				},
			}, {
				mac: {
					$regex: reg,
				},
			},
		];
	} else {
		query.$or = [
			{
				connected: false,
				time: {
					$gte: Date.now() - 60 * 60 * 24 * 30 * 1000,
				},
			}, {
				connected: true,
			},
		];
	}

	try {
		const count = await mongo.mac.count(query);
		const result = await mongo.mac.find(query, {
		}, {
			limit: 10,
			skip: 10 * input.skip,
			sort: {
				connected: 'desc',
			},
		}).populate({
			path: 'agent', select: 'name account privileges -_id',
		});

		return res.json({
			count,
			result,
		});
	} catch (err) {
		return next(err);
	}
}

async function update(req, res, next) {
	debug('Enter update method!');

	const rules = {
		company: 'string|required',
		mac: 'string|required',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await mongo.mac.findByIdAndUpdate(req.params.id, {
			company: input.company,
		}, {
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
		const result = await mongo.mac.findByIdAndRemove(req.params.id);

		return res.json({
			status: true,
		})
	} catch (err) {
		return next(err);
	}

}

async function show(req, res, next) {
	debug('Enter show method!');

	try {
		const result = await mongo.mac.findById(req.params.id);
		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}

}

async function acTypeProportion(req, res, next) {
	debug('Enter acTypeProportion method!');

	try {
		const result = await mongo.mac.aggregate([
			{
				$match: {
					type: {
						$exists: true,
					},
				},
			}, {
				$group: {
					_id: "$type",
					num: {
						$sum: 1,
					},
				},
			},
		]).sort({
			num: -1,
		});
		return res.json({
			result,
		});
	} catch (err) {
		return next(err);
	}

}

function macBingAgent(req, res, next) {
	debug('Enter macBingAgent method!');
	try {
		const macList = req.body;
		let counter = 0;
		let result = [];
		macList.forEach(async (item) => {
			const tiemResult = await mongo.mac.findOneAndUpdate({
				mac: item,
			},
			{
				agent: req.params.id,
				bindTime: Date.now(),
			},
			{
				upsert: true,
			});
			result.push(tiemResult);
			counter++;
			
		  if (counter === macList.length){
				return await res.json({
					result,
				});
			}
			
		})

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
	macBingAgent,
	acTypeProportion,
}