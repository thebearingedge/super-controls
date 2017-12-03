import { describe, it } from 'mocha'
import { expect, freeze } from './__test__'
import { set, unset } from './util'

describe('util', () => {

  describe('set', () => {

    it('replaces an element in an array', () => {
      const input = freeze(['foo', 'bar'])
      const output = set(input, [1], 'baz')
      expect(output).to.deep.equal(['foo', 'baz'])
    })

    it('replaces a property on an object', () => {
      const input = freeze({ foo: 'bar' })
      const output = set(input, ['foo'], 'baz')
      expect(output).to.deep.equal({ foo: 'baz' })
    })

    it('replaces an element in an array property', () => {
      const input = freeze({ foo: ['bar', 'baz'] })
      const output = set(input, ['foo', 0], 'qux')
      expect(output).to.deep.equal({ foo: ['qux', 'baz'] })
    })

    it('replaces a property on a nested object', () => {
      const input = freeze({ foo: { bar: 'baz' } })
      const output = set(input, ['foo', 'bar'], 'qux')
      expect(output).to.deep.equal({ foo: { bar: 'qux' } })
    })

    it('replaces an element in a nested array', () => {
      const input = freeze([[['foo', 'bar', 'baz']]])
      const output = set(input, [0, 0, 1], 'qux')
      expect(output).to.deep.equal([[['foo', 'qux', 'baz']]])
    })

    it('replaces a property on an object in an array', () => {
      const input = freeze([{ foo: 'bar' }, { foo: 'baz' }])
      const output = set(input, [1, 'foo'], 'qux')
      expect(output).to.deep.equal([{ foo: 'bar' }, { foo: 'qux' }])
    })

    it('creates an object that does not exist', () => {
      const input = freeze({
        foo: {
          bar: [{ baz: 'qux' }, { baz: 'quux' }]
        }
      })
      const output = set(input, ['foo', 'bar', 2, 'baz'], 'quuz')
      expect(output).to.deep.equal({
        foo: {
          bar: [{ baz: 'qux' }, { baz: 'quux' }, { baz: 'quuz' }]
        }
      })
    })

    it('creates an array that does not exist', () => {
      const input = freeze([
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } }
      ])
      const output = set(input, [2, 'foo', 'bar', 0], 'corge')
      expect(output).to.deep.equal([
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } },
        { foo: { bar: ['corge'] } }
      ])
    })

    it('inserts into an array that does not exist', () => {
      const input = freeze([
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } }
      ])
      const output = set(input, [2, 'foo', 'bar', 1], 'corge')
      expect(output).to.deep.equal([
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } },
        { foo: { bar: [void 0, 'corge'] } }
      ])
    })

  })

  describe('unset', () => {

    it('removes an element from an array', () => {
      const input = freeze(['foo', 'bar', 'baz'])
      const output = unset(input, [1])
      expect(output).to.deep.equal(['foo', 'baz'])
    })

    it('removes a property from an object', () => {
      const input = freeze({ foo: 'bar' })
      const output = unset(input, ['foo'])
      expect(output).to.deep.equal({})
    })

    it('removes a property from an object in an array', () => {
      const input = freeze([{ foo: 'bar' }, { foo: 'bar' }])
      const output = unset(input, [1, 'foo'])
      expect(output).to.deep.equal([{ foo: 'bar' }, {}])
    })

    it('removes an element from an object array property', () => {
      const input = freeze({ foo: ['bar', 'baz'] })
      const output = unset(input, ['foo', 1])
      expect(output).to.deep.equal({ foo: ['bar'] })
    })

    it('removes an element from nested arrays', () => {
      const input = freeze([['foo'], [[['bar'], 'baz']]])
      const output = unset(input, [1, 0, 1])
      expect(output).to.deep.equal([['foo'], [[['bar']]]])
    })

    it('removes properties from nested objects', () => {
      const input = freeze({ foo: { bar: { baz: 'qux' } } })
      const output = unset(input, ['foo', 'bar', 'baz'])
      expect(output).to.deep.equal({ foo: { bar: {} } })
    })

    it('bails if the path ends in undefined', () => {
      const arrays = freeze([['foo'], [[['bar'], 'baz']]])
      const _arrays = unset(arrays, [1, 1, 1], 'baz')
      expect(_arrays).to.deep.equal(arrays)
      const objects = freeze({ foo: { bar: { baz: 'qux' } } })
      const _objects = unset(objects, ['foo', 'bar', 'qux'], 'qux')
      expect(_objects).to.deep.equal(objects)
    })

  })

})
