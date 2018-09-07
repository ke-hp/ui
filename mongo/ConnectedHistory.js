module.exports = (mongoose) => {
	const Model = mongoose.model('connectedHistory', new mongoose.Schema({
		mac: {
			type: String, required: true,
		},
		connected: {
			type: Boolean, required: true,
		},
		time: {
			type: Date,
		},
	}));
	return Model;
}