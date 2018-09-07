module.exports = (mongoose) => {
	const Model = mongoose.model('macPort', new mongoose.Schema({
		mac: {
			type: String, required: true, unique: true,
		},
		port: {
			type: Number, min: 5000, max: 60000,
		},
	}));
	return Model;
}