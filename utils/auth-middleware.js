const BadRequestError = require('../model/error/bad-request')
const UnauthorizedError = require('../model/error/unauthorized')
const { load } = require('./file-loader')
const { configValidator } = require('./validators')

const configuredSecretKey = configValidator(load('config.json')).secretKey

const extractSecretKey = requestContext => {
  if (!requestContext) {
    throw new BadRequestError('Missing request context')
  }

  if (!requestContext.settings) {
    throw new BadRequestError('Missing settings in request context')
  }

  if (!requestContext.settings.secretKey) {
    throw new BadRequestError('Missing secret key in settings')
  }

  return requestContext.settings.secretKey
}

const authMiddleware = (req, _, next) => {
  const secretKey = extractSecretKey(req.body.requestContext)

  if (configuredSecretKey !== secretKey) {
    throw new UnauthorizedError('Provided secret key does not match')
  }

  next()
}

module.exports = authMiddleware
