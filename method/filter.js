module.exports = function (data, rules) {
	const input = {
	};
	Object.keys(rules).forEach(val => {
		if (data[val] && typeof data[val] !== 'string') {
			input[val] = data[val];
		} else if (data[val] && data[val].trim()) {
			input[val] = data[val].trim();
		}
	});
	return input;
};