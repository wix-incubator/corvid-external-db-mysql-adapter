const load = require('../../utils/fileLoader')

const config = load('config.json')

module.exports = table => {
  return {
    displayName: table.table,
    id: table.table,
    allowedOperations: config.allowedOperations,
    maxPageSize: 50,
    fields: convertFields(table.columns)
  }
}

const convertFields = columns => {
  return columns
    .map(field => {
      return {
        displayName: field.name,
        type: extractFieldType(field.type),
        queryOperators: [
          '$eq',
          '$lt',
          '$gt',
          '$hasSome',
          '$and'
        ]
      }
    })
    .reduce((map, obj) => {
      map[obj.displayName] = obj
      return map
    }, {})
}

const extractFieldType = dbType => {
  const type = dbType
    .toLowerCase()
    .split('(')
    .shift()

  switch(type) {
    case 'varchar': return 'text'
    case 'text': return 'text'
    case 'decimal': return 'number'
    case 'bigint': return 'number'
    case 'int': return 'number'
    case 'bigint': return 'number'
    case 'tinyint': return 'boolean'
    case 'time': return 'text'
    case 'datetime': return 'datetime'
    case 'json': return 'object'
    default: {
      console.warn(`Unknown MySQL type for conversion: ${type}. Defaulting to object.`)
      return 'object'
    }
  }
}
