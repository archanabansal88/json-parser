/* global describe, it, expect, stringParser,arrayParser, numberParser, objectParser, JSONParser */

// stringParser test cases---

describe('String Parser', function () {
  it('should return valid string if found', function () {
    const obj = {
      '"abc\\"c"d"': ['abc\"c', 'd"'],
      '"hello\n"123"': ['hello\n', '123"'],
      '""': ['', '']
    }
    for (const key in obj) {
      expect(stringParser(key)).toEqual(obj[key])
    }
  })

  it('should return null if invalid string', function () {
    const invalidString = [
      '"dfgvbh', '"', '5767', '\\'
    ]
    invalidString.forEach((value) => {
      expect(stringParser(value)).toEqual(null)
    })
  })
})

// arrayParser test cases---

describe('Array Parser', function () {
  it('should return valid array if found', function () {
    const obj = {
      '[ "a" , "b"]]': [ [ 'a', 'b' ], ']' ],
      '["a\nb" , ["b", ["b", "c"]]]': [['a\nb', ['b', ['b', 'c']]], ''],
      '["a" , 123]': [['a', 123], ''],
      '[]': [[], '']
    }
    for (const key in obj) {
      expect(arrayParser(key)).toEqual(obj[key])
    }
  })

  it('should return null if invalid array', function () {
    const invalidArray = [
      '[ "a" ,]', '[ "a" 1 , "b"]', '[ "a" ,, "b"]', '["a" , null123,,hhhd]', '["a\\\\\n" , 1"23,   ,]', '["a" ,true,]'
    ]
    invalidArray.forEach((value) => {
      expect(arrayParser(value)).toEqual(null)
    })
  })
})

// objectParser test cases---

describe('Object Parser', function () {
  it('should return valid object if found', function () {
    const obj = {
      '{"a":"abc"}': [ { a: 'abc' }, '' ],
      '{"a":{"1":2},"b":123   ,  "c":[1,2]}': [ { a: { '1': 2 }, b: 123, c: [ 1, 2 ] }, '' ]
    }
    for (const key in obj) {
      expect(objectParser(key)).toEqual(obj[key])
    }
  })

  it('should return null if invalid object', function () {
    const invalidObject = [
      '{"1":123,2:"abc"}', '{,}', '{"a":"ab\\nc", , "b":}', '{"a":[1,1,2,]}', '{"a":{1:2}}', '{"a"', '{a}', ''
    ]
    invalidObject.forEach((value) => {
      expect(objectParser(value)).toEqual(null)
    })
  })
})

// numberParser test cases---

describe('Number Parser', function () {
  it('should return valid number if found', function () {
    const obj = {
      '-123jhgjghj': [-123, 'jhgjghj']
    }
    for (const key in obj) {
      expect(numberParser(key)).toEqual(obj[key])
    }
  })

  it('should return null if invalid number', function () {
    const invalidNumber = [
      '"dfgvbh', '"', 'fg5767', '\\'
    ]
    invalidNumber.forEach((value) => {
      expect(numberParser(value)).toEqual(null)
    })
  })
})

// JSONParser test cases--

describe('JSON Parser', function () {
  it('should return valid JSON if found', function () {
    const obj = {
      '[ "a" , "b"]': ['a', 'b'],
      '{}': {}
    }
    for (const key in obj) {
      expect(JSONParser(key)).toEqual(obj[key])
    }
  })

  it('should return Invalid JSON if invalid JSON', function () {
    const invalidJson = [
      '[ "a" , "b"]]', '[a]', '"a" , "b"'
    ]
    invalidJson.forEach((value) => {
      expect(JSONParser(value)).toEqual('Invalid JSON')
    })
  })
})
