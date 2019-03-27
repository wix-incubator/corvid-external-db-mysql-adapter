const BadRequestError = require('../model/error/bad-request')
const UnsupportedTypeError = require('../model/error/unsupported-type')

const { describeDatabase } = require('../client/database')

exports.find = async payload => {
  const { schemaIds } = payload
  if (!schemaIds) throw new BadRequestError('Missing schemaIds in request body')

  const schemas = await extractAllSchemas()
  const filtered = schemas.filter(schema => schemaIds.includes(schema.id))

  return {
    schemas : filtered
  }
}

exports.list = async _ => {
  return {
    schemas: await extractAllSchemas()
  }
}

exports.provision = async payload => {
  await extractAllSchemas()

  return { }
}

const extractAllSchemas = async () => {
  const tables = await describeDatabase()

  return tables.map(table => {
    return {
      displayName: table.table,
      id: table.table,
      allowedOperations: [
        'insert',
        'update',
        'get',
        'remove',
        'find',
        'count'
      ],
      maxPageSize: 50,
      fields: convertFields(table.columns)
    }
  })
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
  //TODO Implement correct mysql type translation
  const typeLower = dbType.toLowerCase()

  if (typeLower.includes('varchar') || typeLower.includes('string')) {
    return 'text'
  }

  if (typeLower.includes('tinyint')) {
    return 'boolean'
  }

  if (typeLower === 'datetime' 
    || typeLower === 'date' 
    || typeLower === 'timestamp') {
    return 'datetime'
  }

  if (typeLower.includes('int') || typeLower === 'numeric') {
    return 'number'
  }

  return 'object'
}
