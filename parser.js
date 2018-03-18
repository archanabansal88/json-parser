const booleanParser = input => {
  if (input.startsWith('true')) {
    return [true, input.slice(4)]
  }

  if (input.startsWith('false')) {
    return [false, input.slice(5)]
  }

  return null
}

const nullParser = input => {
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

const numberParser = input => {
  let regexNum = /^(?:-)?(?:0|\d+)(?:\.\d+)?(?:(?:e|E)(?:\+|-)?\d+)?/
  let num = input.match(regexNum)
  if (num) {
    return [parseFloat(num[0]), input.slice(num[0].length)]
  }
  return null
}

const stringParser = input => {
  /*
  checking if the input data is begins with double quotes '"'
  */
  if (input[0] !== '"') {
    return null
  }
  let escapes = {
    'b': '\b',
    'n': '\n',
    't': '\t',
    'r': '\r',
    'f': '\f',
    '"': '"',
    '\\': '\\'
  }

  input = input.slice(1)
  let str = ''
  while (input[0] !== '"') {
    if (input[0] === '\\') {
      input = input.slice(1)
      /*
        checking for escape characters
        */
      if (escapes.hasOwnProperty(input[0])) {
        str += escapes[input[0]]
      } else {
        str += input[0]
      }
      input = input.slice(1)
      continue
    }
    str += input[0]
    input = input.slice(1)
  }
  /*
  checking if the input data is ends with double quotes '"'
  */
  if (input[0] === '"') {
    input = input.slice(1)
    return [str, input]
  }
}

const spaceParser = input => {
  let regexSpace = /^\s+/
  let space = input.match(regexSpace)
  return space ? [space[0], input.slice(space[0].length)] : null
}

const commaParser = input => {
  if (input.startsWith(',')) {
    return [',', input.slice(1)]
  }
  return null
}

const arrayParser = input => {
  /*
  checks if the input data begins with '['
  */
  if (input[0] !== '[') {
    return null
  }
  let arr = []
  input = input.slice(1)
  input = trimSpaces(input)
  while (input[0] !== ']') {
    /*
      passing the input to valueParser and if value is not valid then returning null
   */
    let valueOutput = valueParser(input)
    if (valueOutput) {
      arr.push(valueOutput[0])
      input = valueOutput[1]
    } else {
      return null
    }
    input = trimSpaces(input)

    /* After getting the value checking for comma
       * if comma is not present and its not the last value, then it is not a valid object
       * else loop again
       */
    let commaOutput = commaParser(input)
    if (commaOutput) {
      input = commaOutput[1]
      if (input[0] === ']') {
        return null
      }
      input = trimSpaces(input)
    } else {
      input = trimSpaces(input)
      if (input[0] !== ']') {
        return null
      }
    }
  }
  if (input[0] === ']') {
    input = input.slice(1)
    return [arr, input]
  }
}

const colonParser = input => {
  if (input.startsWith(':')) {
    return [':', input.slice(1)]
  }
  return null
}

const trimSpaces = input => {
  let spaceOutput = spaceParser(input)
  if (spaceOutput) {
    input = spaceOutput[1]
  }
  return input
}

const objectParser = input => {
  /*
  checks if the input data begins with '{'
  */
  if (input[0] !== '{') {
    return null
  }
  input = input.slice(1)
  let key = []
  let value = []
  let obj = {}
  input = trimSpaces(input)
  while (input[0] !== '}') {
    /*
    * check if key is String else it is not a valid object
    */
    let stringOutput = stringParser(input)
    if (stringOutput) {
      key.push(stringOutput[0])
      input = stringOutput[1]
    } else {
      return null
    }

    /* After extracting key, check for colon
       * if colon is not present, then it is not a valid object
       * else get the value
       */
    input = trimSpaces(input)
    let colonOutput = colonParser(input)
    if (colonOutput) {
      input = colonOutput[1]

      if (input[0] === '}') {
        return null
      }
      /*
        passing input to valueParser and extract the value
        */
      input = trimSpaces(input)
      let valueOut = valueParser(input)
      if (valueOut) {
        value.push(valueOut[0])
        input = valueOut[1]
      }
    } else {
      return null
    }

    /* After extracting key and value check for comma
       * if comma is not present and its not the last value, then it is not a valid object
       * else loop again
       */
    input = trimSpaces(input)
    let commaOutput = commaParser(input)
    if (commaOutput) {
      input = commaOutput[1]
      if (input[0] === '}') {
        return null
      }
    } else {
      input = trimSpaces(input)
      if (input[0] !== '}') {
        return null
      }
    }
  }
  if (input[0] === '}') {
    input = input.slice(1)
  }
  /*
    setting key and value to empty object
    */
  for (let i = 0; i < key.length; i++) {
    obj[key[i]] = value[i]
  }
  return [obj, input]
}

const factoryParser = (...parsers) => {
  return function (input) {
    for (let value of parsers) {
      let valueOutput = value(input)
      if (valueOutput) {
        return valueOutput
      }
    }
    return null
  }
}
const valueParser = factoryParser(
  nullParser,
  booleanParser,
  numberParser,
  stringParser,
  arrayParser,
  objectParser
)

const JSONParser = function (input) {
  input = trimSpaces(input)
  let result = valueParser(input)
  if (result && trimSpaces(result[1]) !== '') {
    return 'Invalid JSON'
  } else if (result) {
    return result[0]
  } else {
    return 'Invalid JSON'
  }
}

exports.parse = JSONParser
