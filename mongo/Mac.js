module.exports = (mongoose) => {
	const Model = mongoose.model('mac', new mongoose.Schema({
		mac: {
			type: String,
			required: true,
			unique: true,
		},
		company: {
			type: String,
		},
		connected: {
			type: Boolean,
			default: false,
		},
		time: {
			type: Date,
			default: Date.now(),
		},
	}));
	return Model;
}