const fs = require('fs')

let cache = {}

const load = filename => {
    if (!cache[filename]) {
        try {
            const file = fs.readFileSync(filename)
            const parsed = JSON.parse(file)

            cache[filename] = parsed
        } catch (e) {
            console.error(`Failed loading the ${filename} file.`, e)
            throw e
        }
    }
    
    return cache[filename]
}

module.exports = load
