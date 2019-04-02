const BadRequestError = require('../../model/error/bad-request')
const mysql = require('mysql')

const EMPTY = ''

exports.parseFilter = filter => {
  if (filter && filter.operator) {
    const parsed = parseInternal(filter)
    return parsed ? `WHERE ${parsed}` : EMPTY
  }

  return EMPTY
}

const parseInternal = filter => {
  switch (filter.operator) {
    case '$and': {
      const value = filter.value.map(parseInternal).join(' AND ')
      return value ? `(${value})` : value
    }
    case '$or': {
      const value = filter.value.map(parseInternal).join(' OR ')
      return value ? `(${value})` : value
    }
    case '$not': {
      const value = parseInternal(filter.value)
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
    case '$contains': {
      const list = filter.value.map(mysql.escape).join(', ')
      return list ? `${filter.fieldName} IN (${list})` : EMPTY
    }
    case '$urlized': {
      const list = filter.value.map(s => s.toLowerCase()).join('[- ]')
      return list ? `LOWER(${filter.fieldName}) RLIKE '${list}'` : EMPTY
    }
    case '$startsWith':
      return `${filter.fieldName} LIKE ${mysql.escape(`${filter.value}%`)}`
    case '$endsWith':
      return `${filter.fieldName} LIKE ${mysql.escape(`%${filter.value}`)}`
    case '$eq': {
      return filter.value === null || filter.value === undefined
        ? `${filter.fieldName} IS NULL`
        : `${filter.fieldName} = ${mysql.escape(filter.value)}`
    }
    default:
      throw new BadRequestError(
        `Filter of type ${filter.operator} is not supported.`
      )
  }
}
