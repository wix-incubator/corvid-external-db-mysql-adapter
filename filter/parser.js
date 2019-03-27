const mysql = require('mysql')

exports.parseToClause = filter => {
  if (filter && filter.operator) {
    const parsed = parse(filter)
    return parsed ? `WHERE ${parsed}` : parsed
  }
}

const parse = filter => {
  switch(filter.operator) {
    case '$and':
      return filter.value.map(parse).join(' AND ')
    case '$lt':
      return `${filter.fieldName} < ${mysql.escape(filter.value)}`
    case '$gt':
      return `${filter.fieldName} > ${mysql.escape(filter.value)}`
    case '$hasSome':
      return `${filter.fieldName} IN (${filter.value.map(mysql.escape).join(', ')})`
    case '$eq':
      return `${filter.fieldName} = ${mysql.escape(filter.value)}`
    default:
      throw new BadRequestError(`Filter of type ${filter.operator} is not supported.`)
  }
}
