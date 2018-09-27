module.exports = (mongoose) => {
	const Model = mongoose.model('mac', new mongoose.Schema({
		agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			index: true,
		},
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
		},
		bindTime: {
			type: Date,
		},
	}).index({
		mac: 1, connected: 1,
	}));
	return Model;
}