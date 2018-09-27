module.exports = (mongoose) => {
	const Model = mongoose.model('command', new mongoose.Schema({
		abbr: {
			type: String, required: true, unique: true,
		},
		command: {
			type: String, required: true, unique: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			index: true,
		},
	}));
	return Model;
}