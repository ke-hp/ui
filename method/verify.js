const debug = require('debug')('ui:verify');
const jwt = require('./jwt');
const mongo = require(`${__base }mongo`);

module.exports = async function (req, res, next) {
	debug('Enter verify method!');

	try {
		const token = req.body.token || req.query.token || req.headers.authorization;

		if (token) {
			const decode = token.split(' ')[1];
			const result = jwt.verify(decode);

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
				return res.status(401).json();
			}

			if (user.privileges !== "admin") {
				const noAccessUrl = [
					"/ui/numstat", "/ui/chartdata", "/ui/proportion", "/ui/commands", "/ui/macGroups",
				];
				if (noAccessUrl.includes(req.baseUrl)) {
					return res.status(401).json();
				}
			}

			res.locals.user = user;
			res.locals.session = session;
			return next();
		} else {
			return res.status(401).json();
		}
	} catch (err) {
		return next(err);
	}

};