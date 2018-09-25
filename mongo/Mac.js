module.exports = (mongoose) => {
	const Model = mongoose.model('mac', new mongoose.Schema({
		agent:
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user',
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
			default: Date.now(),
		},
	}));
	return Model;
}