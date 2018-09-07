'use strict';

const JWT = require('jsonwebtoken');

const jwt = module.exports = {
};

jwt.sign = function (data) {
	const token = JWT.sign({
		type: data.type,
		account: data.account,
	}, 'secret', {
		algorithm: 'HS256',
		issuer: 'ui.io',
		jwtid: data.jti,
		expiresIn: '12h',
	});

	return token;
};

jwt.verify = function (token) {
	try {
		const decode = JWT.verify(token, 'secret');
		return decode;
	} catch (err) {
		return err;
	}
};