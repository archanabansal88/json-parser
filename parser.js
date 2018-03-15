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
  let regexNum = /^[-]?(\d+(\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?/
  let num = input.match(regexNum)
  if (num) {
    return [parseFloat(num[0]), input.slice(num[0].length)]
  }
  return null
}

const stringParser = input => {
  if (input[0] === '"') {
    var escapes = {
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
    while (input && input[0] !== '"') {
      if (input[0] === '\\') {
        input = input.slice(1)
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
    if (input[0] === '"') {
      input = input.slice(1)
      return [str, input]
    }
  }
  return null
}

const spaceParser = input => {
  let regexSpace = /^\s*/
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
  if (input[0] === '[') {
    let arr = []
    input = input.slice(1)

    while (input && input[0] !== ']') {
      input = trimSpaces(input)

      if (input[0] === ']') {
        return [arr, input.slice(1)]
      }

      // passing the input to valueParser
      let valueOutput = valueParser(input)
      if (valueOutput) {
        arr.push(valueOutput[0])
        input = valueOutput[1]
      } else {
        return null
      }
      input = trimSpaces(input)

      // checking for comma
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
  return null
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
  if (input[0] === '{') {
    input = input.slice(1)
    let key = []
    let value = []
    let obj = {}
    while (input[0] !== '}') {
      input = trimSpaces(input)

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

        // passing input to valueParser
        input = trimSpaces(input)
        let valueOut = valueParser(input)
        if (valueOut) {
          value.push(valueOut[0])
          input = valueOut[1]
        }
      } else {
        return null
      }

      // checking for comma
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

    for (let i = 0; i < key.length; i++) {
      obj[key[i]] = value[i]
    }
    return [obj, input]
  }
  return null
}

const factoryParser = (...parsers) => {
  return function (input) {
    for (let value of parsers) {
      if (value(input)) {
        return value(input)
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
  let result = valueParser(input)
  if (result && result[1] !== '') {
    return 'Invalid JSON'
  } else if (result) {
    return result[0]
  } else {
    return 'Invalid JSON'
  }
}

exports.parse = JSONParser
