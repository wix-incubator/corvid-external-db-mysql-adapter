const mysql = require('mysql')
const load = require('../utils/fileLoader')

const sqlConfig = load('config.json').sqlConfig
const connection = mysql.createConnection(sqlConfig)

exports.select = (table, clause, skip, limit) =>
  query(
    `SELECT * FROM ${table} ${clause} LIMIT ${skip}, ${limit}`,
    {},
    identity => identity
  )

exports.insert = (table, item) =>
  query(`INSERT INTO ${table} SET ?`, item, () => item)

exports.update = (table, item) =>
  query(
    `UPDATE ${table} SET ? WHERE _id = ${connection.escape(item._id)}`,
    item,
    () => item
  )

exports.deleteOne = (table, itemId) =>
  query(
    `DELETE FROM ${table} WHERE _id = ${connection.escape(itemId)}`,
    {},
    result => result.affectedRows
  )

exports.count = table =>
  query(`SELECT COUNT(*) FROM ${table}`, {}, result => result[0]['COUNT(*)'])

exports.describeDatabase = () =>
  query('SHOW TABLES', {}, async result => {
    const tables = result.map(entry => entry[`Tables_in_${sqlConfig.database}`])

    return Promise.all(
      tables.map(async table => {
        const columns = await describeTable(table)

        return {
          table,
          columns
        }
      })
    )
  })

const describeTable = table =>
  query(`DESCRIBE ${table}`, {}, result => {
    return result.map(entry => {
      return {
        name: entry['Field'],
        type: entry['Type'],
        isPrimary: entry['Key'] === 'PRI'
      }
    })
  })

const query = (query, values, handler) =>
  new Promise((resolve, reject) => {
    connection.query(query, values, (err, results, fields) => {
      if (err) {
        reject(err)
      }

      resolve(handler(results, fields))
    })
  })
