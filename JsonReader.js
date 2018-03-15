const fs = require('fs')
const parser = require('./parser.js')
const file = process.argv[2]

fs.readFile(file, 'utf-8', (error, data) => {
  if (error) throw error
  console.log(parser.parse(data))
})
