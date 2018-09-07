// test lib
const request = require('superagent');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const expect = chai.expect;
chai.use(chaiSubset);

const commonHelper = require('../helpers/commonHelper');

describe('user', function () {

	const common = {
		user: {
		},
	};
	it(' create should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.post(`${commonHelper.getSiteUrl()}/ui/users`)
				.set('Authorization', `Bearer ${global.user.token}`)
				.send({
					account: 'wifi',
					password: 'nradiowifi@com',
				})
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							account: 'wifi',
						},
					});
					resolve();
				});
		});
	});

	it(' login should work', async function () {
		const data = {
			account: 'wifi',
			password: 'nradiowifi@com',
		};
		await login(data, common);
	});

	it(' get all should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.get(`${commonHelper.getSiteUrl()}/ui/users`)
				.set('Authorization', `Bearer ${common.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: [
							{
								account: 'nradio',
							}, {
								account: 'wifi',
							},
						],
					});
					resolve();
				});
		});
	});

	it(' get one should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.get(`${commonHelper.getSiteUrl()}/ui/users/${common.user.id}`)
				.set('Authorization', `Bearer ${common.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							account: 'wifi',
						},
					});
					resolve();
				});
		});
	});

	it(' change password should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.put(`${commonHelper.getSiteUrl()}/ui/users/${common.user.id}`)
				.set('Authorization', `Bearer ${common.user.token}`)
				.send({
					password: 'nradiowifi@wifi.com',
				})
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							account: 'wifi',
						},
					});
					resolve();
				});
		});
	});

	it(' login should work', async function () {
		const data = {
			account: 'wifi',
			password: 'nradiowifi@wifi.com',
		};
		await login(data, common);
	});

	it(' delete one should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.delete(`${commonHelper.getSiteUrl()}/ui/users/${common.user.id}`)
				.set('Authorization', `Bearer ${common.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						status: true,
					});
					resolve();
				});
		});
	});

});

function login(data, common) {
	return new Promise(function (resolve, reject) {
		request
			.post(`${commonHelper.getSiteUrl()}/login`)
			.send(data)
			.end(function (err, res) {
				expect(res.ok).to.be.true;
				expect(res.body).to.containSubset({
					account: data.account,
				});
				common.user = res.body;
				resolve();
			});
	});
};