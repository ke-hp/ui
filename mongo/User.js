module.exports = (mongoose) => {
	const Model = mongoose.model('user', new mongoose.Schema({
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