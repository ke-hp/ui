#!/usr/bin/env node

// init
global.__base = `${__dirname }/../`;
require('dotenv').config({
	path: `${__base }.env`,
});

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

// Instantiate a Mocha instance.
const mocha = new Mocha({
	bail: true,
	timeout: 100000,
});
const routeSpecDir = `${__dirname}/test`;
const runAllSpec = true;
const specList = ['command_spec.js'];
const coreSpecList = ['index.js'];
mocha.addFile(path.join(routeSpecDir), 'index.js');

// Add each .js file to the mocha instance
fs.readdirSync(routeSpecDir).filter(file => file.substr(-3) === '.js').forEach((file) => {
	if (!coreSpecList.includes(file) && (runAllSpec || specList.includes(file))) {
		mocha.addFile(path.join(routeSpecDir, file));
	}
});


mocha.run((failures) => {
	process.on('start', () => {});
	process.on('exit', () => {
		process.exit(failures);
	});
	process.exit(failures);
});