module.exports = (mongoose) => {
	const Model = mongoose.model('session', new mongoose.Schema({
		account: {
			type: String,
			required: true,
		},
		privileges: {
			type: String,
			required: true,
		},
		jti: {
			type: String,
			required: true,
			index: true,
		},
		ip: {
			type: String,
			required: true,
		},
		time: {
			type: Date,
		},
	}, {
		autoIndex: false,
	}));
	return Model;
}