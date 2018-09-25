// dependencies
const userRoute = require(`${__base }routes/user`);
const macRoute = require(`${__base }routes/mac`);
const verify = require(`${__base }method/verify`);
const commandRoute = require(`${__base }routes/command`);
const numStatRoute = require(`${__base }routes/numStat`);
const connectedHistoryRoute = require(`${__base }routes/connectedHistory`);
const execRoute = require(`${__base }routes/exec`);
const sysinfoRoute = require(`${__base }routes/sysinfo`);
const macGroupRoute = require(`${__base }routes/macGroup`);
const chartDataRoute = require(`${__base }routes/chartData`);
function route(app) {
	// user
	app.post('/login', userRoute.login);
	app.use('/ui/*', verify);
	app.delete('/ui/logout', userRoute.logout);
	app.get('/ui/users', userRoute.index);
	app.get('/ui/userList', userRoute.userList);
	app.get('/ui/allUser', userRoute.getAllUserInfo);
	app.post('/ui/users', userRoute.create);
	app.get('/ui/users/:id([0-9,a-z]+)', userRoute.show);
	app.put('/ui/users/:id([0-9,a-z]+)', userRoute.update);
	app.delete('/ui/users/:id([0-9,a-z]+)', userRoute.destroy);
	// mac
	app.get('/ui/macs', macRoute.index);
	app.post('/ui/macs', macRoute.create);
	app.get('/ui/macs/:id([0-9,a-z]+)', macRoute.show);
	app.put('/ui/macs/:id([0-9,a-z]+)', macRoute.update);
	app.put('/ui/macBingAgent/:id([0-9,a-z]+)', macRoute.macBingAgent);
	app.delete('/ui/macs/:id([0-9,a-z]+)', macRoute.destroy);
	// command
	app.get('/ui/commands', commandRoute.index);
	app.post('/ui/commands', commandRoute.create);
	app.put('/ui/commands/:id([0-9,a-z]+)', commandRoute.update);
	app.delete('/ui/commands/:id([0-9,a-z]+)', commandRoute.destroy);
	app.post('/ui/commands/send', commandRoute.send);
	app.post('/ui/commands/rssh', commandRoute.startRemoteConn);
	app.post('/ui/commands/rweb', commandRoute.startRemoteConn);
	// search
	app.get('/ui/connectedHistories', connectedHistoryRoute.index);
	app.get('/ui/execs', execRoute.index);
	app.get('/ui/sysinfo', sysinfoRoute.index);
	// chart
	app.get('/ui/numstat', numStatRoute.index);
	app.get('/ui/chartdata', chartDataRoute.index);
	app.get('/ui/proportion', macRoute.acTypeProportion);
	// macGroups
	app.get('/ui/macGroups', macGroupRoute.index);
	app.post('/ui/macGroups', macGroupRoute.create);
	app.get('/public/macGroups/sysInfo', macGroupRoute.show);
	app.put('/ui/macGroups/:id([0-9,a-z]+)', macGroupRoute.update);
	app.delete('/ui/macGroups/:id([0-9,a-z]+)', macGroupRoute.destroy);
}
module.exports = route;