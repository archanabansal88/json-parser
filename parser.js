const booleanParser = input => {
	if (input.indexOf("true") === 0) {
		return [true, input.slice(4, input.length)];
	}

	if (input.indexOf("false") === 0) {
		return [false, input.slice(5, input.length)];
	}

	return null;
};
//console.log(booleanParser("true123")) // op-- [true,"123"]
//console.log(booleanParser("123false"))// op-- null
//console.log(booleanParser("fal123"))// op-- null

const nullParser = input => {
	if (input.indexOf("null") === 0) {
		return [null, input.slice(4, input.length)];
	}
	return null;
};

//console.log(nullParser("null123"))// op--[null, "123"]
//console.log(nullParser("123null"))// op-- null
//console.log(nullParser12("null")) // op--[null, ""]
//console.log(nullParser12("123"))// op-- null
