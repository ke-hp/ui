module.exports = (mongoose) => {
	const Model = mongoose.model('user', new mongoose.Schema({
		name: {
			type: String,
		},
		privileges: {
			type: String,
			default: "agent",
		},
		account: {
			type: String, required: true, unique: true, index: true,
		},
		password: {
			type: String, required: true,
		},
	}, {
		autoIndex: false,
	}));
	return Model;
}