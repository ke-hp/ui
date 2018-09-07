// core
const debug = require('debug')('ui:rest');
const http = require('http');
// model
const app = http.createServer(require(`${__base }app`));
const cryptic = require(`${__base }method/cryptic`);
const mongo = require(`${__base }mongo`);

// test lib
const request = require('superagent');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const expect = chai.expect;
chai.use(chaiSubset);

const commonHelper = require('../helpers/commonHelper');

// global data
global.data = {
	user: {
	},
};

before(async function () {
	this.timeout(50000);
	app.listen(7777);
	await mongo.command.remove();
	await mongo.mac.remove();
	await mongo.user.remove();
	const password = cryptic.hmac('nradiowifi@com', 'nradiowifi@com');
	await mongo.user.create({
		account: 'nradio',
		password: password,
	});
});

before(async function () {
	const data = {
		account: 'nradio',
		password: 'nradiowifi@com',
	};
	await new Promise(function (resolve, reject) {
		request
			.post(`${commonHelper.getSiteUrl()}/login`)
			.send(data)
			.end(function (err, res) {
				expect(res.ok).to.be.true;
				expect(res.body).to.containSubset({
					account: 'nradio',
				});
				global.user = res.body;
				resolve();
			});
	});

});