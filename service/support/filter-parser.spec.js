const { assert } = require('chai')
const { parseToClause } = require('./filter-parser')
const BadRequestError = require('../../model/error/bad-request')

describe.only('Filter Parser', () => {
  describe('parseToClause', () => {
    it('handles empty filter', async () => {
      const filter = null

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles incorrect filter', async () => {
      const filter = {
        42: true
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles empty and filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$and',
        value: []
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles empty or filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$or',
        value: []
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles and filter with one subfilter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$and',
        value: [
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'foo',
            value: 'bar'
          }
        ]
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE (foo = 'bar')")
    })

    it('handles or filter with one subfilter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$or',
        value: [
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'foo',
            value: 'bar'
          }
        ]
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE (foo = 'bar')")
    })

    it('handles and filter with two subfilters', async () => {
      const filter = {
        kind: 'filter',
        operator: '$and',
        value: [
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'foo',
            value: 'bar'
          },
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'baz',
            value: 'boo'
          }
        ]
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE (foo = 'bar' AND baz = 'boo')")
    })

    it('handles or filter with two subfilters', async () => {
      const filter = {
        kind: 'filter',
        operator: '$or',
        value: [
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'foo',
            value: 'bar'
          },
          {
            kind: 'filter',
            operator: '$eq',
            fieldName: 'baz',
            value: 'boo'
          }
        ]
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE (foo = 'bar' OR baz = 'boo')")
    })

    it('handles not filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$not',
        value: {
          kind: 'filter',
          operator: '$eq',
          fieldName: 'foo',
          value: 'bar'
        }
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE NOT (foo = 'bar')")
    })

    it('handles ne filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$ne',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo <> 'bar'")
    })

    it('handles lt filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$lt',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo < 'bar'")
    })

    it('handles lte filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$lte',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo <= 'bar'")
    })

    it('handles gt filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$gt',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo > 'bar'")
    })

    it('handles gte filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$gte',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo >= 'bar'")
    })

    it('handles empty hasSome filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$hasSome',
        fieldName: 'foo',
        value: []
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles hasSome filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$hasSome',
        fieldName: 'foo',
        value: ['bar', 'baz']
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo IN ('bar', 'baz')")
    })

    it('handles contains filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$contains',
        fieldName: 'foo',
        value: ['bar', 'baz']
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo IN ('bar', 'baz')")
    })

    it('handles empty contains filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$contains',
        fieldName: 'foo',
        value: []
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles empty urlized filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$urlized',
        fieldName: 'foo',
        value: []
      }

      const result = parseToClause(filter)

      assert.equal(result, '')
    })

    it('handles urlized filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$urlized',
        fieldName: 'foo',
        value: ['BaR', '42', 'baz']
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE LOWER(foo) RLIKE 'bar[- ]42[- ]baz'")
    })

    it('handles startsWith filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$startsWith',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo LIKE 'bar%'")
    })

    it('handles endsWith filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$endsWith',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo LIKE '%bar'")
    })

    it('handles eq filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$eq',
        fieldName: 'foo',
        value: 'bar'
      }

      const result = parseToClause(filter)

      assert.equal(result, "WHERE foo = 'bar'")
    })

    it('throws bad request error for unknown filter', async () => {
      const filter = {
        kind: 'filter',
        operator: '$unknown',
        fieldName: 'foo',
        value: 'bar'
      }

      const throwing = () => parseToClause(filter)

      assert.throws(
        throwing,
        BadRequestError,
        'Filter of type $unknown is not supported.'
      )
    })
  })
})
