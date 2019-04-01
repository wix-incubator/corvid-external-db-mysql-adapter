const { assert } = require('chai')
const { configValidator } = require('./validators')
const BadRequestError = require('../model/error/bad-request')

describe('Validators', () => {
  describe('configValidator', () => {
    it('throws when secretKey is not present', async () => {
      const config = {}

      const throwing = () => configValidator({ ...config })

      assert.throws(
        throwing,
        BadRequestError,
        'Missing secret key data in configuration.'
      )
    })

    it('is successful', async () => {
      const config = {
        secretKey: 'bird-is-the-word'
      }

      const validated = configValidator({ ...config })

      assert.deepEqual(validated, config)
    })
  })
})
