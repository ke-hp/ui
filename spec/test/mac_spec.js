// test lib
const request = require('superagent');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const expect = chai.expect;
chai.use(chaiSubset);

const commonHelper = require('../helpers/commonHelper');
describe('mac', function () {
	const common = {
		mac: {
		},
	};
	it(' create mac should work', async function () {
		const data = {
			mac: 'AACCFFEE1122',
			company: 'nradio',
		};
		await new Promise(function (resolve, reject) {
			request
				.post(`${commonHelper.getSiteUrl()}/ui/macs`)
				.set('Authorization', `Bearer ${global.user.token}`)
				.send(data)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							mac: data.mac,
						},
					});
					common.mac = res.body.result;
					resolve();
				});
		});
	});

	it(' get one should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.get(`${commonHelper.getSiteUrl()}/ui/macs/${common.mac._id}`)
				.query({
					skip: 0,
				})
				.set('Authorization', `Bearer ${global.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							mac: common.mac.mac,
						},
					});
					resolve();
				});
		});
	});

	it(' get macs should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.get(`${commonHelper.getSiteUrl()}/ui/macs`)
				.query({
					skip: 0,
				})
				.set('Authorization', `Bearer ${global.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: [
							{
								mac: common.mac.mac,
							},
						],
					});
					resolve();
				});
		});
	});

	it(' update macs should work', async function () {
		const data = {
			mac: common.mac.mac,
			company: 'nradiowifi',
		};
		await new Promise(function (resolve, reject) {
			request
				.put(`${commonHelper.getSiteUrl()}/ui/macs/${common.mac._id}`)
				.set('Authorization', `Bearer ${global.user.token}`)
				.send(data)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							company: data.company,
						},
					});
					resolve();
				});
		});
	});

	it(' delete macs should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.delete(`${commonHelper.getSiteUrl()}/ui/macs/${common.mac._id}`)
				.set('Authorization', `Bearer ${global.user.token}`)
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