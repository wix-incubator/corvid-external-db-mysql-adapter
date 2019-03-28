const BadRequestError = require('../model/error/bad-request')
const { describeDatabase } = require('../client/database')
const convertTable = require('./support/table-converter')

exports.find = async payload => {
  const { schemaIds } = payload
  if (!schemaIds) throw new BadRequestError('Missing schemaIds in request body')

  const schemas = (await extractAllSchemas()).filter(schema => schemaIds.includes(schema.id))

  return { schemas }
}

exports.list = async _ => {
  const schemas = await extractAllSchemas()

  return { schemas }
}

exports.provision = async payload => {
  await extractAllSchemas()

  return { }
}

const extractAllSchemas = async () => {
  const tables = await describeDatabase()
  return tables.map(convertTable)
}
