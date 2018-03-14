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

const nullParser = input => {
	input = spaceParser(input)[1];
	if (input.startsWith("null")) {
		return [null, input.slice(4)];
	}
	return null;
};

const numberParser = input => {
	input = spaceParser(input)[1];
	let regexNum = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/;
	let num = input.match(regexNum);
	if (num) {
		return [parseFloat(num[0]), input.slice(num[0].length)];
	}
	return null;
};

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
				return "Invalid JSON";
			}
			if (commaParser(input)) {
				input = commaParser(input)[1];
				if (input[0] === "]") {
					return "Invalid JSON";
				}
			} else if (input[0] !== "]" && commaParser(input) === null) {
				return "Invalid JSON";
			}
		}
		if (input[0] === "]") {
			input = input.slice(1);
			return [arr, input];
		}
	}
	return null;
};

const colonParser = input => {
	input = spaceParser(input)[1];
	if (input.startsWith(":")) {
		return [":", input.slice(1)];
	}
	return null;
};

const objectParser = input => {
	input = spaceParser(input)[1];

	if (input[0] === "{") {
		let obj = {};
		input = input.slice(1);
		let key = [],
			value = [];

		while (input[0] !== "}") {
			if (stringParser(input)) {
				key.push(stringParser(input)[0]);
				input = stringParser(input)[1];
			} else {
				return "Invalid JSON";
			}
			if (colonParser(input)) {
				input = colonParser(input)[1];
				if (input[0] === "}") {
					return "Invalid JSON";
				}
				if (valueParser(input)) {
					value.push(valueParser(input)[0]);
					input = valueParser(input)[1];
				}
			} else {
				return "Invalid JSON";
			}
			if (commaParser(input)) {
				input = commaParser(input)[1];
				if (input[0] === "}") {
					return "Invalid JSON";
				}
			} else if (input[0] !== "}" && commaParser(input) === null) {
				return "Invalid JSON";
			}
		}
		if (input[0] === "}") {
			input = input.slice(1);
		}

		for (let i = 0; i < key.length; i++) {
			obj[key[i]] = value[i];
		}
		return [obj, input];
	}
	return null;
};

const JSONParser = function(input) {
	let result = valueParser(input);
	if (result && result[1] !== "") {
		console.log("invalid JSON");
	} else if (result) {
		console.log(JSON.stringify(result[0]));
	} else {
		console.log("invalid JSON");
	}
};

const factoryParser = (...parsers) => {
	return function(input) {
		for (let value of parsers) {
			if (value(input)) {
				return value(input);
			}
		}
		return null;
	};
};
const valueParser = factoryParser(
	nullParser,
	booleanParser,
	numberParser,
	stringParser,
	arrayParser,
	objectParser
);

/*
-----------Test cases-------------

//boolean parser--

console.log(booleanParser("true123"));
console.log(booleanParser("123false"));
console.log(booleanParser("fal123"));

// null parser---

console.log(nullParser("null123"));
console.log(nullParser("123null"));
console.log(nullParser("null"));
console.log(nullParser("123"));

//number parser--

console.log(numberParser("12.38888jhgjghj"));
console.log(numberParser("-123jhgjghj"));
console.log(numberParser("7.71234e+2jhgjghj"));
console.log(numberParser("0000jhgjghj"));

//string parser---

console.log(stringParser('"hello\n"123"'));
console.log(stringParser('"abc\\"c"d"'));
console.log(stringParser('""'));

//array parser---

console.log(arrayParser('[ "a" ,]'));
console.log(arrayParser('[ "a" ,, "b"]'));
console.log(arrayParser('[ "a" 1 , "b"]'));
console.log(arrayParser('[ "a" , "b"]]'));
console.log(arrayParser('["a\nb" , ["b", ["b", "c"]]]'));
console.log(arrayParser('["a" , 123]'));
console.log(arrayParser('["a" , null123,,hhhd]'));
console.log(arrayParser('["a\\\\\n" , 1"23,   ,]'));
console.log(arrayParser('["a" ,true,]'));
console.log(arrayParser("[]"));


// object parser---

console.log(objectParser('{"1":123,2:"abc"}'));
console.log(objectParser("{,}"));
console.log(objectParser('{"a":"abc"}'));
console.log(objectParser('{"a":"ab\\nc", , "b":}'));
console.log(objectParser('{"a":[1,1,2,]}'));
console.log(objectParser('{"a":{1:2}}'));
console.log(objectParser('{"a":{"1":2},"b":123   ,  "c":[1,2]}'));
console.log(objectParser('{"a"'));
console.log(objectParser("{a}"));

//JSON parser--

JSONParser('[ "a" , "b"]]');
JSONParser('[ "a" , "b"]');
JSONParser("[a]");
JSONParser("{}");
JSONParser('"a" , "b"');

*/
