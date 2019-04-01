const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('File Loader', () => {
  describe('load', () => {
    const readFileSyncStub = sinon.stub()
    const loader = proxyquire('./file-loader', {
      fs: {
        readFileSync: readFileSyncStub
      }
    })

    it('caches results', () => {
      const filename = 'config.json'
      const raw = { foo: 'bar' }
      const json = JSON.stringify(raw)
      readFileSyncStub.withArgs(filename).returns(json)

      const config = loader.load(filename)
      const secondConfig = loader.load(filename)

      sinon.assert.calledOnce(readFileSyncStub)
      expect(config).to.deep.equal(raw)
      expect(secondConfig).to.deep.equal(raw)
    })
  })
})
