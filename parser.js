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
  let regexNum = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/
  let num = input.match(regexNum)
  if (num) {
    return [parseFloat(num[0]), input.slice(num[0].length)]
  }
  return null
}

const stringParser = input => {
  if (input[0] === '"') {
    input = input.slice(1)
    let str = ''
    while (input && input[0] !== '"') {
      if (input[0] === '\\') {
        str += input.slice(0, 2)
        input = input.slice(2)
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
  if (space) {
    return [space[0], input.slice(space[0].length)]
  }
  return null
}

const commaParser = input => {
  if (spaceParser(input)) {
    input = spaceParser(input)[1]
  }
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
      if (spaceParser(input)) {
        input = spaceParser(input)[1]
      }
      // passing the input to valueParser
      if (valueParser(input)) {
        arr.push(valueParser(input)[0])
        input = valueParser(input)[1]
      } else {
        return null
      }
      // checking for comma
      if (commaParser(input)) {
        input = commaParser(input)[1]
        if (input[0] === ']') {
          return null
        }
        if (spaceParser(input)) {
          input = spaceParser(input)[1]
        }
      } else if (input[0] !== ']' && !commaParser(input)) {
        return null
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
  if (spaceParser(input)) {
    input = spaceParser(input)[1]
  }
  if (input.startsWith(':')) {
    return [':', input.slice(1)]
  }
  return null
}

const objectParser = input => {
  if (input[0] === '{') {
    input = input.slice(1)
    let key = []
    let value = []
    let obj = {}
    while (input[0] !== '}') {
      if (spaceParser(input)) {
        input = spaceParser(input)[1]
      }
      // checking if input[0] is string or not
      if (stringParser(input)) {
        key.push(stringParser(input)[0])
        input = stringParser(input)[1]
      } else {
        return null
      }
      // checking for colon
      if (colonParser(input)) {
        input = colonParser(input)[1]
        if (input[0] === '}') {
          return null
        }
        if (spaceParser(input)) {
          input = spaceParser(input)[1]
        }
        // passing input to valueParser
        if (valueParser(input)) {
          value.push(valueParser(input)[0])
          input = valueParser(input)[1]
        }
      } else {
        return null
      }
      // checking for comma
      if (commaParser(input)) {
        input = commaParser(input)[1]
        if (input[0] === '}') {
          return null
        }
        if (spaceParser(input)) {
          input = spaceParser(input)[1]
        }
      } else if (input[0] !== '}' && commaParser(input) === null) {
        return null
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

const JSONParser = function (input) { // eslint-disable-line no-unused-vars
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
