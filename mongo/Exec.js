module.exports = (mongoose) => {
	const Model = mongoose.model('exec', new mongoose.Schema({
		mac: {
			type: String, required: true,
		},
		cmd: {
			type: String, required: true,
		},
		user: {
			type: String, required: true,
		},
		timestamp: {
			type: String, required: true, unique: true,
		},
	}));
	return Model;
}