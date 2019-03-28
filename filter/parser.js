const BadRequestError = require('../model/error/bad-request')
const mysql = require('mysql')

exports.parseToClause = filter => {
  if (filter && filter.operator) {
    const parsed = parse(filter)
    return parsed ? `WHERE ${parsed}` : parsed
  }

  return ''
}

const parse = filter => {
  switch (filter.operator) {
    case '$and': {
      const value = filter.value.map(parse).join(' AND ')
      return value ? `(${value})` : value
    }
    case '$or': {
      const value = filter.value.map(parse).join(' OR ')
      return value ? `(${value})` : value
    }
    case '$not': {
      const value = parse(filter.value)
      return value ? `NOT (${value})` : value
    }
    case '$ne':
      return `${filter.fieldName} <> ${mysql.escape(filter.value)}`
    case '$lt':
      return `${filter.fieldName} < ${mysql.escape(filter.value)}`
    case '$lte':
      return `${filter.fieldName} <= ${mysql.escape(filter.value)}`
    case '$gt':
      return `${filter.fieldName} > ${mysql.escape(filter.value)}`
    case '$gte':
      return `${filter.fieldName} >= ${mysql.escape(filter.value)}`
    case '$hasSome':
      return `${filter.fieldName} IN (${filter.value
        .map(mysql.escape)
        .join(', ')})`
    case '$contains':
      return `${filter.fieldName} IN (${filter.value
        .map(mysql.escape)
        .join(', ')})`
    case '$urlized':
      return `LOWER(${filter.fieldName}) RLIKE '${filter.value
        .map(s => s.toLowerCase())
        .join('[- ]')}'`
    case '$startsWith':
      return `${filter.fieldName} LIKE '${filter.value}%'`
    case '$endsWith':
      return `${filter.fieldName} LIKE '%${filter.value}'`
    case '$eq':
      return `${filter.fieldName} = ${mysql.escape(filter.value)}`
    default:
      throw new BadRequestError(
        `Filter of type ${filter.operator} is not supported.`
      )
  }
}
