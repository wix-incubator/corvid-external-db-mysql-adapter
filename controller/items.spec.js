const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')

chai.use(chaiAsPromised)

const controller = require('./items')
const Storage = require('../service/storage')
const sandbox = sinon.createSandbox()

describe('Items Controller', () => {

  afterEach(() => {
    sandbox.restore()
  })

  describe('findItems', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'find').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.findItems(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })

  describe('getItem', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'get').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.getItem(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })

  describe('insertItem', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'insert').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.insertItem(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })

  describe('updateItem', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'update').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.updateItem(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })

  describe('removeItem', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'remove').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.removeItem(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })

  describe('countItems', () => {
    it('calls storage and responds with JSON', async () => {
        //given
        const req = { body: 42 }
        const payload = { foo: "bar" }
        sandbox.stub(Storage, 'count').withArgs(req.body).returns(payload)
        const jsonResponseHandler = sandbox.stub()
        const responseHandlers = { json: jsonResponseHandler }

        //when
        await controller.countItems(req, responseHandlers)
        
        //then
        sandbox.assert.calledOnce(jsonResponseHandler)
        sandbox.assert.calledWith(jsonResponseHandler, payload)
    })
  })
})
