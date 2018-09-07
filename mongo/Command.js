module.exports = (mongoose) => {
	const Model = mongoose.model('command', new mongoose.Schema({
		abbr: {
			type: String, required: true, unique: true,
		},
		command: {
			type: String, required: true, unique: true,
		},
	}));
	return Model;
}