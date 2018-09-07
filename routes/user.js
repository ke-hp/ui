const debug = require('debug')('ui:user');

// library
const uuid = require('uuid');
const jwt = require(`${__base }method/jwt`);
const cryptic = require(`${__base }method/cryptic`);
const validator = require('Validator');
const mongo = require(`${__base }mongo`);
const filter = require(`${__base }method/filter`);

async function login(req, res, next) {
	debug('Enter login method!');
	const rules = {
		account: 'required|string',
		password: 'required|string|min:6',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const user = await mongo.user.findOne({
			account: input.account,
		});
		const status = await cryptic.compare(input.password, input.password, user.password);
		if (!status) {
			return res.status(404).json({
				status: false,
				message: '账号或密码错误',
			});
		}

		const jti = uuid.v4();
		const token = jwt.sign({
			type: 'user',
			account: user.account,
			jti: jti,
		});

		await mongo.session.create({
			account: input.account,
			jti: jti,
			ip: req.ip,
			time: Date.now(),
		});

		return res.json({
			token: token,
			id: user.id,
			account: user.account,
		});
	} catch (err) {
		return next(err);
	}
};

async function logout(req, res, next) {
	debug('Enter logout method!');

	try {
		await mongo.session.findByIdAndRemove(res.locals.session._id);
		return res.json({
			status: true,
		});
	} catch (err) {
		return next(err);
	}

}
async function create(req, res, next) {
	debug('Enter create method!');

	const rules = {
		account: 'required|string',
		password: 'required|string|min:6',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const password = cryptic.hmac(input.password, input.password);

		const result = await mongo.user.create({
			account: input.account,
			password: password,
		});

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
	};
	const input = filter(req.query, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	const reg = new RegExp(input.name, 'i');

	try {
		const result = await mongo.user.find({
			account: {
				$regex: reg,
			},
		}, {
			password: 0,
		}, {
			sort: {
				_id: -1,
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
		password: 'string|required|min:6',
	};

	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const password = cryptic.hmac(input.password, input.password);

		const result = await mongo.user.findByIdAndUpdate(req.params.id, {
			password: password,
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
		const result = await mongo.user.findByIdAndRemove(req.params.id);

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
		const result = await mongo.user.findById(req.params.id);
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
	login,
	logout,
	create,
	update,
	destroy,
};