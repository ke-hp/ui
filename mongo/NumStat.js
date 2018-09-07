module.exports = (mongoose) => {
	const Model = mongoose.model('numStat', new mongoose.Schema({
		num: {
			type: Number,
			required: true,
		},
		time: {
			type: Date,
			required: true,
			unique: true,
		},
	}));
	return Model;
}