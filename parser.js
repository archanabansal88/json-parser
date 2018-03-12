const booleanParser = input => {
	if (input.startsWith("true")) {
		return [true, input.slice(4)];
	}

	if (input.startsWith("false")) {
		return [false, input.slice(5)];
	}

	return null;
};
//console.log(booleanParser("true123")) // op-- [true,"123"]
//console.log(booleanParser("123false"))// op-- null
//console.log(booleanParser("fal123"))// op-- null

const nullParser = input => {
	if (input.startsWith("null")) {
		return [null, input.slice(4)];
	}
	return null;
};

//console.log(nullParser("null123"))// op--[null, "123"]
//console.log(nullParser("123null"))// op-- null
//console.log(nullParser("null")) // op--[null, ""]
//console.log(nullParser("123"))// op-- null

const numberParser = input => {
	let regexNum = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/;
	let num = input.match(regexNum);
	if (num !== null) {
		return [parseFloat(num[0]), input.slice(num[0].length)];
	}
	return null;
};

// console.log(numberParser("12.38888jhgjghj"));
// console.log(numberParser("-123jhgjghj"));
// console.log(numberParser("7.71234e+2jhgjghj"));
// console.log(numberParser("0000jhgjghj"));
