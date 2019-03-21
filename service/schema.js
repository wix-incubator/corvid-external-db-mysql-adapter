const load = require('../utils/fileLoader')

const schemas = load('schemas.json')

exports.find = async payload => {
  const { schemaIds } = payload
  if (!schemaIds) throw new BadRequestError('Missing schemaIds in request body')

  const filtered = schemas.filter(schema => schemaIds.includes(schema.id))
  
  return {
    schemas : filtered
  }
}

exports.list = async payload => {
  return { schemas }
}

exports.provision = async payload => {
  throw 'Not Implemented'
}
