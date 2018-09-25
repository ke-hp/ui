const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

const basename = path.basename(module.filename);
const db = {
};

fs.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf('.') !== 0) && (file !== basename);
	})
	.forEach(function (file) {
		if (file.slice(-3) !== '.js') {
			return;
		}
		let model = require(`./${file}`)(mongoose);
		db[model.modelName] = model;
	});

const mongo = mongoose.connection;

mongo.on('error', function (err) {
	console.log('Connection error:', err.message);
});

mongo.once('open', async function callback() {
	console.log("Connected to DB!");

	const adminUsers = await db.user.find({
		privileges: "admin",
	});
	if (adminUsers.length > 0) {
		return ;
	}

	// create admin user
	const cryptic = require(`${__base }method/cryptic`);
	const password = cryptic.hmac('nradiowifi@com', 'nradiowifi@com');
	await db.user.create({
		account: 'nradio_admin',
		password: password,
		privileges: "admin",
	});
});

module.exports = db;