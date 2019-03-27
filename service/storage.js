const uuid = require('uuid/v4')
const BadRequestError = require('../model/error/bad-request')
const NotFoundError = require('../model/error/not-found')

const { parseToClause } = require('../filter/parser')
const { select, count, insert, update, deleteOne } = require('../client/database')

exports.find = async payload => {
    const { collectionName, filter, skip, limit } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!skip && skip !== 0) throw new BadRequestError('Missing skip in request body')
    if (!limit) throw new BadRequestError('Missing limit in request body')

    return {
        items: await select(collectionName, parseToClause(filter), skip, limit),
        totalCount: await count(collectionName)
    }
}

exports.get = async payload => {
    const { collectionName, itemId } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!itemId) throw new BadRequestError('Missing itemId in request body')

    const items = await select(collectionName, `WHERE _id = '${itemId}'`, 0, 1)

    if (items.length === 1) {
        return {
            item: items[0]
        }
    }

    throw new NotFoundError(`Item with id ${itemId} not found.`)
}

exports.insert = async payload => {
    const { collectionName, item } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!item) throw new BadRequestError('Missing item in request body')

    if (!item._id) item._id = uuid()

    return {
        item: await insert(collectionName, item)
    }
}

exports.update = async payload => {
    const { collectionName, item } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!item) throw new BadRequestError('Missing item in request body')
    
    return {
        item: await update(collectionName, item)
    }
}

exports.remove = async payload => {
    const { collectionName, itemId } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!itemId) throw new BadRequestError('Missing itemId in request body')

    const items = await select(collectionName, `WHERE _id = '${itemId}'`, 0, 1)
    const itemsChanged = await deleteOne(collectionName, itemId)

    if (itemsChanged === 0) {
        throw new NotFoundError(`Item with id ${itemId} does not exist.`)
    }

    return { item: items[0] }
}

exports.count = async payload => {
    const { collectionName } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')

    return {
        totalCount: await count(collectionName)
    }
}
