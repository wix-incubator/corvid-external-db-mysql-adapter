const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const service = require('./schema')

describe('Schema Service', () => {
  describe('find', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.find()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('list', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.list()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('provision', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.provision()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })
})
