const BadRequestError = require('../model/error/bad-request')
const UnauthorizedError = require('../model/error/unauthorized')
const load = require('./file-loader')
const { configValidator } = require('./validators')

const configuredSecretKey = configValidator(load('config.json')).secretKey

const extractSecretKey = requestContext => {
  if (!requestContext) {
    throw new BadRequestError('Missing request context')
  }

  if (!requestContext.settings || !requestContext.settings.secretKey) {
    throw new UnauthorizedError('Missing secret key in request context')
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
