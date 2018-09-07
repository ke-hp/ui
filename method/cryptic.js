'use strict';

const crypto = require('crypto');

const cryptic = module.exports = {
};

cryptic.encrypt = function (str, key) {
	if (typeof key === 'undefined') {
		throw Error("无效的字符串：key不存在");
	}
	if (typeof str !== 'string' || typeof key !== 'string') {
		throw Error(`非法参数: ${typeof str}, ${typeof key}`);
	}

	const cipher = crypto.createCipher('aes192', key);
	let encrypted = cipher.update(str, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
};

cryptic.decrypt = function(str, key) {
	if (typeof key === 'undefined') {
		throw Error("无效的字符串：key不存在");
	}
	if (typeof str !== 'string' || typeof key !== 'string') {
		throw Error(`非法参数: ${typeof str}, ${typeof key}`);
	}

	const decipher = crypto.createDecipher('aes192', key);
	let decrypted = decipher.update(str, 'utf8', 'hex');
	decrypted += decipher.final('hex');
	return decrypted;
};

cryptic.hmac = function (str, key) {
	if (typeof key === 'undefined') {
		throw Error("无效的字符串：key不存在");
	}
	if (typeof str !== 'string' || typeof key !== 'string') {
		throw Error(`非法参数: ${typeof str}, ${typeof key}`);
	}

	const hmac = crypto.createHmac('sha256', key);
	let encrypted = hmac.update(str).digest('hex');
	return encrypted;
};

cryptic.compare = async function (str, key, hmac) {
	if (typeof str !== "string" || typeof key !== "string" || typeof hmac !== "string") {
		throw Error(`非法参数: ${typeof str}, ${typeof key}, ${typeof hmac}`);
	}

	let newHmac = await cryptic.hmac(str, key);
	return safeStringCompare(newHmac, hmac);
};

function safeStringCompare(known, unknown) {
	let right = 0,
		wrong = 0;
	for (let i = 0, k = known.length; i < k; ++i) {
		if (known.charCodeAt(i) === unknown.charCodeAt(i)) {
			++right;
		} else {
			++wrong;
		}
	}
	// Prevent removal of unused variables (never true, actually)
	if (right < 0) {
		return false;
	}
	return wrong === 0;
}