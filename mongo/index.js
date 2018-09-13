const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
} );
mongoose.Promise = global.Promise;
const mongo = mongoose.connection;

mongo.on('error', function (err) {
	console.log('Connection error:', err.message);
});

mongo.once('open', function callback() {
	console.log("Connected to DB!");
});

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
module.exports = db;