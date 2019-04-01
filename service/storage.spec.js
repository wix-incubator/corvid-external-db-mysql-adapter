const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const service = require('./storage')

describe('Storage Service', () => {
  describe('find', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.find()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('get', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.get()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('insert', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.insert()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('update', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.update()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('remove', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.remove()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })

  describe('count', () => {
    it('is rejected with an error', () => {
      //given

      //when
      const call = service.count()

      //then
      expect(call).to.eventually.be.rejectedWith(Error)
    })
  })
})
