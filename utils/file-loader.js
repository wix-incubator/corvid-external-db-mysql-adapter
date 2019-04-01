const fs = require('fs')

let cache = {}

exports.load = filename => {
  if (!cache[filename]) {
    const file = fs.readFileSync(filename)
    const parsed = JSON.parse(file)

    cache[filename] = parsed
  }

  return cache[filename]
}
