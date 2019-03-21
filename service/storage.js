const uuid = require('uuid/v4')
const BadRequestError = require('../model/error/bad-request')

exports.find = async payload => {
    const { collectionName, filter } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')

    throw 'Not Implemented'
}

exports.get = async payload => {
    const { collectionName, itemId } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!itemId) throw new BadRequestError('Missing itemId in request body')

    throw 'Not Implemented'
}

exports.insert = async payload => {
    const { collectionName, item } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!item) throw new BadRequestError('Missing item in request body')
    
    if (!item._id) item._id = uuid()

    throw 'Not Implemented'
}

exports.update = async payload => {
    const { collectionName, item } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!item) throw new BadRequestError('Missing item in request body')
    
    throw 'Not Implemented'
}

exports.remove = async payload => {
    const { collectionName, itemId } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')
    if (!itemId) throw new BadRequestError('Missing itemId in request body')

    throw 'Not Implemented'
}

exports.count = async payload => {
    const { collectionName } = payload
    if (!collectionName) throw new BadRequestError('Missing collectionName in request body')

    throw 'Not Implemented'
}
