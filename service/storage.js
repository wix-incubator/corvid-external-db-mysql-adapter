const uuid = require('uuid/v4')
const BadRequestError = require('../model/error/bad-request')
const NotFoundError = require('../model/error/not-found')

const { parseFilter } = require('./support/filter-parser')
const { parseSort } = require('./support/sort-parser')
const {
  select,
  count,
  insert,
  update,
  deleteOne
} = require('../client/database')

exports.find = async payload => {
  const { collectionName, filter, sort, skip, limit } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')
  if (!skip && skip !== 0)
    throw new BadRequestError('Missing skip in request body')
  if (!limit) throw new BadRequestError('Missing limit in request body')

  const items = await select(
    collectionName,
    parseFilter(filter),
    parseSort(sort),
    skip,
    limit
  )
  const totalCount = await count(collectionName)

  return { items, totalCount }
}

exports.get = async payload => {
  const { collectionName, itemId } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')
  if (!itemId) throw new BadRequestError('Missing itemId in request body')

  const item = (await select(collectionName, `WHERE _id = '${itemId}'`)).shift()

  if (!item) {
    throw new NotFoundError(`Item with id ${itemId} not found.`)
  }

  return { item }
}

exports.insert = async payload => {
  const { collectionName, item } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')
  if (!item) throw new BadRequestError('Missing item in request body')

  if (!item._id) item._id = uuid()

  const inserted = await insert(collectionName, item)

  return { item: inserted }
}

exports.update = async payload => {
  const { collectionName, item } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')
  if (!item) throw new BadRequestError('Missing item in request body')

  const updated = await update(collectionName, item)

  return { item: updated }
}

exports.remove = async payload => {
  const { collectionName, itemId } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')
  if (!itemId) throw new BadRequestError('Missing itemId in request body')

  const item = await select(collectionName, `WHERE _id = '${itemId}'`).shift()
  const itemsChanged = await deleteOne(collectionName, itemId)

  if (!itemsChanged || !item) {
    throw new NotFoundError(`Item with id ${itemId} does not exist.`)
  }

  return { item }
}

exports.count = async payload => {
  const { collectionName } = payload
  if (!collectionName)
    throw new BadRequestError('Missing collectionName in request body')

  const totalCount = await count(collectionName)

  return { totalCount }
}
