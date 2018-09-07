const faker = require('faker');

const commonHelper = module.exports = {
	faker: {
	},
};

commonHelper.getSiteUrl = function () {
	return 'http://127.0.0.1:7777';
};

module.exports = commonHelper;