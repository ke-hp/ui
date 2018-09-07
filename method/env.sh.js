const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
module.exports = () => {
	const SSH_KEY = process.env.SSH_KEY
		.replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
		.replace(/-----END RSA PRIVATE KEY-----/g, "")
		.replace(/\ +/g, "\n");
	const KEY = `-----BEGIN RSA PRIVATE KEY-----${SSH_KEY}-----END RSA PRIVATE KEY-----`;
	[
		'rssh', 'rweb',
	].forEach(async (dataType, i) => {
		let envContent = await readFile(`${__base}env.sh`, 'utf8');
		let newEnvContent = envContent
			.replace(/{NODE_ENV_GLSRV}/g, process.env[`${dataType.toUpperCase()}_PORT`])
			.replace(/{NODE_ENV_SSH_KEY}/g, KEY)
			.replace(/{NODE_ENV_RTYPE}/g, dataType)
			.replace(/{NODE_ENV_RTYPE_URL}/g, process.env.RTYPE_URL);
		writeFile(`${__base}views/${dataType}-env.sh`, newEnvContent, 'utf8');
	})
}