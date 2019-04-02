const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const BadRequestError = require('../model/error/bad-request')
const NotFoundError = require('../model/error/not-found')

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Storage Service', () => {
  const selectStub = sinon.stub()
  const countStub = sinon.stub()
  const insertStub = sinon.stub()
  const updateStub = sinon.stub()
  const deleteOneStub = sinon.stub()
  const parseStub = sinon.stub()

  const service = proxyquire('./storage', {
    '../client/database': {
      select: selectStub,
      count: countStub,
      insert: insertStub,
      update: updateStub,
      deleteOne: deleteOneStub
    },
    './support/filter-parser': {
      parse: parseStub
    }
  })

  describe('find', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {
        filter: {
          kind: 'filter',
          operator: '$eq',
          fieldName: 'foo',
          value: 'bar'
        },
        skip: 0,
        limit: 50
      }

      const call = service.find(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is rejected with an error when skip is missing', () => {
      const payload = {
        collectionName: 'playground',
        filter: {
          kind: 'filter',
          operator: '$eq',
          fieldName: 'foo',
          value: 'bar'
        },
        limit: 50
      }

      const call = service.find(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing skip in request body'
      )
    })

    it('is rejected with an error when limit is missing', () => {
      const payload = {
        collectionName: 'playground',
        filter: {
          kind: 'filter',
          operator: '$eq',
          fieldName: 'foo',
          value: 'bar'
        },
        skip: 0
      }
      const call = service.find(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing limit in request body'
      )
    })

    it('is successful', () => {
      const payload = {
        collectionName: 'playground',
        filter: {
          kind: 'filter',
          operator: '$eq',
          fieldName: 'foo',
          value: 'bar'
        },
        skip: 0,
        limit: 50
      }
      const item = {
        _id: '42',
        foo: 'bar'
      }
      const query = 'fooQuery'

      parseStub.withArgs(payload.filter).returns(query)
      selectStub.withArgs(payload.collectionName, query, 0, 50).returns([item])
      countStub.withArgs(payload.collectionName).returns(1)

      const call = service.find(payload)

      expect(call).to.eventually.be.deep.equal({ items: [item], totalCount: 1 })
    })
  })

  describe('get', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {
        itemId: 'foo'
      }

      const call = service.get(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is rejected with an error when itemId is missing', () => {
      const payload = {
        collectionName: 'playground'
      }

      const call = service.get(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing itemId in request body'
      )
    })

    it('is rejected with an error when item is not found', () => {
      const payload = {
        collectionName: 'playground',
        itemId: '42'
      }
      selectStub
        .withArgs(payload.collectionName, `WHERE _id = '${payload.itemId}'`)
        .returns([])

      const call = service.get(payload)

      expect(call).to.eventually.be.rejectedWith(
        NotFoundError,
        `Item with id ${payload.itemId} not found.`
      )
    })

    it('is successful', () => {
      const payload = {
        collectionName: 'playground',
        itemId: '42'
      }
      const item = {
        _id: '42',
        foo: 'bar'
      }
      selectStub
        .withArgs(
          payload.collectionName,
          `WHERE _id = '${payload.itemId}'`,
          0,
          1
        )
        .returns([item])

      const call = service.get(payload)

      expect(call).to.eventually.be.deep.equal({ item })
    })
  })

  describe('insert', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {
        item: {
          _id: 'foo'
        }
      }

      const call = service.insert(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is rejected with an error when item is missing', () => {
      const payload = {
        collectionName: 'playground'
      }

      const call = service.insert(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing item in request body'
      )
    })

    it('is successful', () => {
      const item = {
        _id: 'foo',
        key: 'value'
      }
      const payload = {
        collectionName: 'playground',
        item
      }
      insertStub.withArgs(payload.collectionName, payload.item).returns(item)

      const call = service.insert(payload)

      expect(call).to.eventually.be.deep.equal({ item })
    })

    it('is succesful with defaulted _id', () => {
      const item = {
        key: 'value'
      }
      const payload = {
        collectionName: 'playground',
        item
      }
      const inserted = {
        _id: '42',
        key: 'value'
      }
      insertStub
        .withArgs(
          payload.collectionName,
          sinon.match(val => val._id && val.key === item.key)
        )
        .returns(inserted)

      const call = service.insert(payload)

      expect(call).to.eventually.be.deep.equal({ item: inserted })
    })
  })

  describe('update', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {
        item: {
          _id: 'foo'
        }
      }

      const call = service.update(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is rejected with an error when item is missing', () => {
      const payload = {
        collectionName: 'playground'
      }

      const call = service.update(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing item in request body'
      )
    })

    it('is successful', () => {
      const item = {
        _id: 'foo',
        key: 'value'
      }
      const payload = {
        collectionName: 'playground',
        item
      }
      updateStub.withArgs(payload.collectionName, payload.item).returns(item)

      const call = service.update(payload)

      expect(call).to.eventually.be.deep.equal({ item })
    })
  })

  describe('remove', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {
        itemId: 'foo'
      }

      const call = service.remove(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is rejected with an error when itemId is missing', () => {
      const payload = {
        collectionName: 'playground'
      }

      const call = service.remove(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing itemId in request body'
      )
    })

    it('is rejected with an error when item does not exist', () => {
      const payload = {
        collectionName: 'playground',
        itemId: 'foo'
      }
      const item = {
        _id: 'foo',
        bar: 'baz'
      }
      selectStub
        .withArgs(payload.collectionName, `WHERE _id = '${payload.itemId}'`)
        .returns([item])
      deleteOneStub.withArgs(payload.collectionName, payload.itemId).returns(0)

      const call = service.remove(payload)

      expect(call).to.eventually.be.rejectedWith(
        NotFoundError,
        `Item with id ${payload.itemId} does not exist.`
      )
    })

    it('is successful', () => {
      const payload = {
        collectionName: 'playground',
        itemId: 'foo'
      }
      const item = {
        _id: 'foo',
        bar: 'baz'
      }
      selectStub
        .withArgs(payload.collectionName, `WHERE _id = '${payload.itemId}'`)
        .returns([item])
      deleteOneStub.withArgs(payload.collectionName, payload.itemId).returns(1)

      const call = service.remove(payload)

      expect(call).to.eventually.be.deep.equal({ item })
    })
  })

  describe('count', () => {
    it('is rejected with an error when collectionName is missing', () => {
      const payload = {}

      const call = service.count(payload)

      expect(call).to.eventually.be.rejectedWith(
        BadRequestError,
        'Missing collectionName in request body'
      )
    })

    it('is successful', () => {
      const payload = {
        collectionName: 'playground'
      }
      countStub.withArgs('playground').returns(42)

      const call = service.count(payload)

      expect(call).to.eventually.be.deep.equal({
        totalCount: 42
      })
    })
  })
})
