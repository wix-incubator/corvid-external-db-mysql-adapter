const { expect, assert } = require('chai')
const { configValidator } = require('./validators')
const BadRequestError = require('../model/error/bad-request')

describe('Validators', () => {
  describe('configValidator', () => {
    it('throws when secretKey is not present', () => {
      const config = {}

      const throwing = () => configValidator({ ...config })

      assert.throws(
        throwing,
        BadRequestError,
        'Missing secret key data in configuration.'
      )
    })

    it('is successful', () => {
      const config = {
        secretKey: 'bird-is-the-word'
      }

      const validated = configValidator({ ...config })

      expect(validated).to.deep.equal(config)
    })
  })
})
