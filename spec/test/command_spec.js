// test lib
const request = require('superagent');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const expect = chai.expect;
chai.use(chaiSubset);
'spec/index.js'
const commonHelper = require('../helpers/commonHelper');
describe('command', function () {
	const common = {
		command: {
		},
	};
	it(' create command should work', async function () {
		const data = {
			abbr: 'update',
			command: 'update',
		};
		await new Promise(function (resolve, reject) {
			request
				.post(`${commonHelper.getSiteUrl()}/ui/commands`)
				.set('Authorization', `Bearer ${global.user.token}`)
				.send(data)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: {
							command: data.command,
						},
					});
					common.command = res.body.result;
					resolve();
				});
		});
	});

	it(' get commands should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.get(`${commonHelper.getSiteUrl()}/ui/commands`)
				.query({
					skip: 0,
				})
				.set('Authorization', `Bearer ${global.user.token}`)
				.end(function (err, res) {
					expect(res.ok).to.be.true;
					expect(res.body).to.containSubset({
						result: [
							{
								command: common.command.command,
							},
						],
					});
					resolve();
				});
		});
	});

	it(' delete commands should work', async function () {
		await new Promise(function (resolve, reject) {
			request
				.delete(`${commonHelper.getSiteUrl()}/ui/commands/${common.command._id}`)
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