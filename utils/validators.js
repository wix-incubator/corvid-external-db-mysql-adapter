const BadRequestError = require('../model/error/bad-request')

exports.configValidator = config => {
  if (!config.secretKey) {
    throw new BadRequestError('Missing secret key data in configuration.')
  }

  return config
}
