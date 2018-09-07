module.exports = (mongoose) => {
	const Model = mongoose.model('macGroup', new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		macs: {
			type: String,
			required: true,
		},
	}));
	return Model;
}