const debug = require('debug')('ui:command');

// lib
const validator = require('Validator');
const mqtt = require('mqtt');
const mongo = require(`${__base}mongo`);
const filter = require(`${__base}method/filter`);

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
		const count = await mongo.command.count({
			user: res.locals.user._id,
			$or: [
				{
					abbr: {
						$regex: reg,
					},
				}, {
					command: {
						$regex: reg,
					},
				},
			],
		});
		const result = await mongo.command.find({
			user: res.locals.user._id,
			$or: [
				{
					abbr: {
						$regex: reg,
					},
				}, {
					command: {
						$regex: reg,
					},
				},
			],
		}, {
		}, {
			limit: 10,
			skip: 10 * input.skip,
			sort: {
				_id: 'desc',
			},
		});

		return res.json({
			count,
			result,
		});
	} catch (err) {
		return next(err);
	}

}

async function create(req, res, next) {
	debug('Enter create method!');

	const rules = {
		abbr: 'string',
		command: 'string|required',
	};
	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		
		input.user = res.locals.user._id;
		const result = await mongo.command.create(input);

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
		const result = await mongo.command.findByIdAndRemove(req.params.id);

		return res.json({
			status: true,
		})
	} catch (err) {
		return next(err);
	}

}

async function update(req, res, next) {
	debug('Enter update method!');

	const rules = {
		abbr: 'string',
		command: 'string|required',
	};
	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await mongo.command.findByIdAndUpdate(req.params.id, {
			abbr: input.abbr,
			command: input.command,
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

async function send(req, res, next) {
	debug('Enter send method!');

	const rules = {
		command: 'string|required',
		mac: 'string|required',
	};
	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		const result = await sendCmdToDev(input.mac, res.locals.user.account, input.command);
		debug('received message');
		return res.json(Object.assign({
			status: true,
		}, result));
	} catch (err) {
		return next(err);
	}

}

async function startRemoteConn(req, res, next) {
	debug(`Enter startRemoteConn method!`)
	const rules = {
		mac: 'string|required',
	};
	const input = filter(req.body, rules);
	const v = validator.make(input, rules);
	if (v.fails()) {
		return next(v.getErrors());
	}

	try {
		let port = null;
		let macPort = await mongo.macPort.findOne({
			mac: input.mac,
		});

		if (macPort) {
			port = macPort.port;
		} else {
			let length = await mongo.macPort.count();
			port = 5000 + length;
			await mongo.macPort.create({
				mac: input.mac,
				port: port,
			});
		}

		const data = `wget -q --ca-certificate=/etc/ssl/certs/ca-certificates.crt -O- "http://${process.env.RTYPE_URL}/${req.path.match(/[^/]+$/g)}-env.sh"|sh -s -- -p ${port}`;
		await sendCmdToDev(input.mac, res.locals.user.account, data);
		res.cookie('pt', port);
		res.cookie('tk', req.headers.authorization.split(' ')[1]);
		return res.json({
			port: port,
		});
		
	} catch (err) {
		debug(err)
		return next(err);
	}
}

function sendCmdToDev(mac, user, data) {
	const command = {
		id: new Date().getTime().toString(),
		type: 'script',
		data: data,
		user: user,
		run_timeout: 10,
	};

	const client = mqtt.connect(process.env.MQTT_HOST, {
		username: process.env.MQTT_USERNAME,
		password: process.env.MQTT_PASSWORD,
	});

	client.on('connect', function () {
		client.subscribe(`${mac}/exec/result`);
		debug('publish', mac);
		client.publish(`${mac}/exec/cmd`, JSON.stringify(command), {
			qos: 1,
		});
	});

	return new Promise(function (resolve, reject) {
		client.on('message', (topic, message) => {
			const payload = JSON.parse(message);
			if (command.id === payload.id) {
				client.end({
					force: true,
				});
				resolve({
					topic: topic,
					message: JSON.parse(message),
				});
			}
		});
		setTimeout(() => {
			client.end({
				force: true,
			});
			reject({
				topic: '错误：',
				message: '等待超时！',
			})
		}, 10000);
	});
}

module.exports = {
	index,
	create,
	destroy,
	update,
	send,
	startRemoteConn,
}