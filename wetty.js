const debug = require('debug')('ui:wetty');
const proxy = require('http-proxy-middleware');
const mongo = require(`${__base }mongo`);
const jwt = require(`${__base }method/jwt`);

module.exports = function (app) {

	const wettyOptions = {
		target: process.env.WETTY_TARGET,
		changeOrigin: true,
	};
	let wettyFilter = function (pathname, req) {
		debug('Enter wettyFilter method!');
		let flag = true;

		if (pathname === '/wetty') {
			flag = false;
			if (req.query.pt) {
				flag = true;
			}
		};
		return flag;

	}
	let wettyProxy = proxy(wettyFilter, wettyOptions);

	app.use('/wetty', verify, wettyProxy);

	const settingOptions = {
		target: process.env.SETTING_TARGET,
		changeOrigin: true,
		pathRewrite: function (path, req) {
			if (req.query.pt) {
				return path;
			} else {
				if (path.includes('?')) {
					return path.concat(`&pt=${req.cookies.pt}`);
				} else {
					return path.concat(`?pt=${req.cookies.pt}`);
				}
			}
		},
	};
	let settingFilter = function (pathname, req) {
		debug('Enter settingFilter method!');
		let flag = true;
		if (pathname.includes('/cgi-bin/luci')) {
			flag = false;
			if (req.query.pt || req.cookies.pt) {
				flag = true;
			}
		};
		return flag;
	}
	let settingProxy = proxy(settingFilter, settingOptions);

	app.use('/cgi-bin/*', verify, settingProxy);
	app.use('/luci-static', proxy(settingOptions));
}

async function verify(req, res, next) {
	debug('Enter proxy verify method!');
	if (req.path === '/') {
		try {
			let port = req.cookies.pt;
			let token = req.cookies.tk;
			if (port && token) {
				let result = jwt.verify(token);

				const session = await mongo.session.findOne({
					jti: result.jti,
				});
				if (session === null || session.ip !== req.ip) {
					return res.status(401).json();
				}

				const user = await mongo.user.findOne({
					account: session.account,
				});

				if (user === null) {
					return res.status(401).json({
						message: '账户或密码错误！',
					});
				}

				return next();
			} else {
				return res.status(404).json({
					message: '创建失败！',
				});
			}
		} catch (err) {
			return res.status(404).json({
				err,
			});
		}
	} else {
		return next();
	}
}