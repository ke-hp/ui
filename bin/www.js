#!/usr/bin/env node

// init
global.__base = `${__dirname }/../`;
require('dotenv').config();

// dependencies
const app = require('../app');
const debug = require('debug')('ui:server');
const http = require('http');

// get port environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// create http server
const server = http.createServer(app);

// listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}

// Event listener for http server 'error' event.
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${ port}` : `Port ${ port}`;

	switch (error.code) {
	case 'EACCES':
		console.error(`${bind } requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(`${bind } is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
}

// Event listener for http server 'listening' event.
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `pipe ${ addr}` : `port ${ addr.port}`;
	debug(`Server started, Listening on:${ bind}`);
	console.log(`Server started, Listening on: ${port}`);
}