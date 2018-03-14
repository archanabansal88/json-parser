const valueParser = input => {
	const parsers = [
		nullParser,
		booleanParser,
		numberParser,
		stringParser,
		arrayParser
	];
	for (let value of parsers) {
		if (value(input)) {
			return value(input);
		}
	}
	return null;
};

const spaceParser = input => {
	let regexSpace = /^\s*/;
	let space = input.match(regexSpace);
	if (space) {
		return [space[0], input.slice(space[0].length)];
	}
	return ["", input];
};

const commaParser = input => {
	input = spaceParser(input)[1];
	if (input.startsWith(",")) {
		return [",", input.slice(1)];
	}
	return null;
};

const booleanParser = input => {
	input = spaceParser(input)[1];
	if (input.startsWith("true")) {
		return [true, input.slice(4)];
	}

	if (input.startsWith("false")) {
		return [false, input.slice(5)];
	}

	return null;
};

// console.log(booleanParser("true123")); // op-- [true,"123"]
// console.log(booleanParser("123false")); // op-- null
// console.log(booleanParser("fal123")); // op-- null

const nullParser = input => {
	input = spaceParser(input)[1];
	if (input.startsWith("null")) {
		return [null, input.slice(4)];
	}
	return null;
};

// console.log(nullParser("null123")); // op--[null, "123"]
// console.log(nullParser("123null")); // op-- null
// console.log(nullParser("null")); // op--[null, ""]
// console.log(nullParser("123")); // op-- null

const numberParser = input => {
	input = spaceParser(input)[1];
	let regexNum = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/;
	let num = input.match(regexNum);
	if (num) {
		return [parseFloat(num[0]), input.slice(num[0].length)];
	}
	return null;
};

// console.log(numberParser("12.38888jhgjghj"));
// console.log(numberParser("-123jhgjghj"));
// console.log(numberParser("7.71234e+2jhgjghj"));
// console.log(numberParser("0000jhgjghj"));

const stringParser = input => {
	input = spaceParser(input)[1];
	if (input[0] !== '"') {
		return null;
	}

	input = input.slice(1);
	let str = "";
	while (input[0] !== '"') {
		if (input[0] === "\\") {
			str += input.slice(0, 2);
			input = input.slice(2);
		}
		str += input[0];
		input = input.slice(1);
	}
	return [str, input.slice(1)];
};

// console.log(stringParser('"hello\n"123"'));
// console.log(stringParser('"abc\\"c"d"'));
// console.log(stringParser('""'));

const arrayParser = input => {
	input = spaceParser(input)[1];
	if (input[0] === "[") {
		let arr = [];
		input = input.slice(1);
		let output;
		while (input[0] !== "]") {
			output = valueParser(input);
			if (output) {
				arr.push(output[0]);
				input = output[1];
			} else {
				return null;
			}
			if (commaParser(input)) {
				input = commaParser(input)[1];
				if (input[0] === "]") {
					return null;
				}
			} else if (input[0] !== "]" && commaParser(input) === null) {
				return null;
			}
		}
		if (input[0] === "]") {
			input = input.slice(1);
			return [arr, input];
		}
	}
	return null;
};

// console.log(arrayParser('[ "a" ,, "b"]'));
// console.log(arrayParser('[ "a" 1 , "b"]'));
// console.log(arrayParser('[ "a" , "b"]]'));
// console.log(arrayParser('[ "a" ,]'));
// console.log(arrayParser('["a\nb" , ["b", ["b", "c"]]]'));
// console.log(arrayParser('["a" , 123]'));
// console.log(arrayParser('["a" , null123,,hhhd]'));
// console.log(arrayParser('["a\\\\\n" , 1"23,   ,]'));
// console.log(arrayParser('["a" ,true,]'));
