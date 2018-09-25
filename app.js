// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// create app
const app = express();

// cookie-parser
app.use(cookieParser());

// wetty
require('./wetty')(app);

// rssh-env & rweb-env
require('./method/env.sh.js')();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

app.use(function (req, res, next) {
	res.locals = {
		user: {
		},
		session: {
		},
	};
	next();
});

// route
require('./route')(app);

app.use('/', express.static(`${__dirname}/views`));
app.get('/[^\.]+$', (req, res) => {
	res.set('Content-Type', 'text/html').sendFile(`${__dirname}/views/index.html`);
});

//  catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 400);
	res.json({
		status: false,
		message: err,
	});
});

module.exports = app;