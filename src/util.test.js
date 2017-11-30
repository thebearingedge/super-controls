import { describe, it } from 'mocha'
import { expect, freeze } from './__test__'
import { add, set, unset } from './util'

describe('util', () => {

  describe('add', () => {

    it('adds an element to an array', () => {
      const input = freeze(['foo', 'baz'])
      const output = add(input, [1], 'bar')
      expect(output).to.deep.equal(['foo', 'bar', 'baz'])
    })

    it('adds a property to an object', () => {
      const input = freeze({ foo: 'bar' })
      const output = add(input, ['baz'], 'qux')
      expect(output).to.deep.equal({ foo: 'bar', baz: 'qux' })
    })

    it('adds an element to an array property', () => {
      const input = freeze({ foo: ['bar', 'qux'] })
      const output = add(input, ['foo', 1], 'baz')
      expect(output).to.deep.equal({ foo: ['bar', 'baz', 'qux'] })
    })

    it('adds a property to a nested object', () => {
      const input = freeze({ foo: { bar: 'baz' } })
      const output = add(input, ['foo', 'qux'], 'corge')
      expect(output).to.deep.equal({
        foo: { bar: 'baz', qux: 'corge' }
      })
    })

    it('adds an element to a nested array', () => {
      const input = freeze([['foo', 'bar'], ['baz']])
      const output = add(input, [1, 1], 'qux')
      expect(output).to.deep.equal([['foo', 'bar'], ['baz', 'qux']])
    })

    it('adds a property to an object in an array', () => {
      const input = freeze([{ foo: 'bar' }, { baz: 'qux' }])
      const output = add(input, [1, 'quux'], 'quuz')
      expect(output).to.deep.equal([
        { foo: 'bar' },
        { baz: 'qux', quux: 'quuz' }
      ])
    })

    it('adds an object that does not exist', () => {
      const input = freeze({})
      const output = add(input, ['foo', 'bar'], 'baz')
      expect(output).to.deep.equal({ foo: { bar: 'baz' } })
    })

    it('adds an array that does not exist', () => {
      const input = freeze({})
      const output = add(input, ['foo', 0], 'bar')
      expect(output).to.deep.equal({
        foo: ['bar']
      })
    })

    it('creates a deeply nested object', () => {
      const input = freeze({})
      const output = add(input, ['foo', 'bar', 'baz'], 'qux')
      expect(output).to.deep.equal({
        foo: {
          bar: {
            baz: 'qux'
          }
        }
      })
    })

    it('adds a property to a deeply nested object', () => {
      const input = freeze({
        foo: {
          bar: {
            baz: 'qux'
          }
        }
      })
      const output = add(input, ['foo', 'bar', 'quux'], 'quuz')
      expect(output).to.deep.equal({
        foo: {
          bar: {
            baz: 'qux',
            quux: 'quuz'
          }
        }
      })
    })

    it('creates a deeply nested array', () => {
      const input = freeze([])
      const output = add(input, [0, 0, 0], 'foo')
      expect(output).to.deep.equal([[['foo']]])
    })

    it('creates a deeply nested array property', () => {
      const input = freeze({})
      const output = add(input, ['foo', 'bar', 'baz', 0], 'qux')
      expect(output).to.deep.equal({
        foo: {
          bar: {
            baz: ['qux']
          }
        }
      })
    })

    it('adds an element to a deeply nested array property', () => {
      const input = freeze({
        foo: {
          bar: {
            baz: ['qux']
          }
        }
      })
      const output = add(input, ['foo', 'bar', 'baz', 1], 'quux')
      expect(output).to.deep.equal({
        foo: {
          bar: {
            baz: ['qux', 'quux']
          }
        }
      })
    })

  })

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
      const input = {
        foo: {
          bar: [{ baz: 'qux' }, { baz: 'quux' }]
        }
      }
      const output = set(input, ['foo', 'bar', 2, 'baz'], 'quuz')
      expect(output).to.deep.equal({
        foo: {
          bar: [{ baz: 'qux' }, { baz: 'quux' }, { baz: 'quuz' }]
        }
      })
    })

    it('creates an array that does not exist', () => {
      const input = [
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } }
      ]
      const output = set(input, [2, 'foo', 'bar', 0], 'corge')
      expect(output).to.deep.equal([
        { foo: { bar: ['baz', 'qux'] } },
        { foo: { bar: ['quux', 'quuz'] } },
        { foo: { bar: ['corge'] } }
      ])
    })

  })

  describe('unset', () => {

    describe('removes an element from an array', () => {

      it('found', () => {
        const input = freeze(['foo', 'bar', 'baz'])
        const output = unset(input, [1], 'bar')
        expect(output).to.deep.equal(['foo', 'baz'])
      })

      it('not found', () => {
        const input = freeze(['foo', 'bar', 'baz'])
        const output = unset(input, [1], 'qux')
        expect(output).to.deep.equal(['foo', 'bar', 'baz'])
      })

    })

    describe('removes a property from an object', () => {

      it('found', () => {
        const input = freeze({ foo: 'bar' })
        const output = unset(input, ['foo'], 'bar')
        expect(output).to.deep.equal({})
      })

      it('not found', () => {
        const input = freeze({ foo: 'bar' })
        const output = unset(input, ['foo'], 'baz')
        expect(output).to.deep.equal({ foo: 'bar' })
      })

    })

    describe('removes a property from an object in an array', () => {

      it('found', () => {
        const input = freeze([{ foo: 'bar' }, { foo: 'bar' }])
        const output = unset(input, [1, 'foo'], 'bar')
        expect(output).to.deep.equal([{ foo: 'bar' }, {}])
      })

      it('not found', () => {
        const input = freeze([{ foo: 'bar' }, { foo: 'bar' }])
        const output = unset(input, [1, 'baz'], 'bar')
        expect(output).to.deep.equal([{ foo: 'bar' }, { foo: 'bar' }])
      })

    })

    describe('removes an element from an object array property', () => {

      it('found', () => {
        const input = freeze({ foo: ['bar', 'baz'] })
        const output = unset(input, ['foo', 1], 'baz')
        expect(output).to.deep.equal({ foo: ['bar'] })
      })

      it('not found', () => {
        const input = freeze({ foo: ['bar', 'baz'] })
        const output = unset(input, ['foo', 1], 'qux')
        expect(output).to.deep.equal({ foo: ['bar', 'baz'] })
      })

    })

    describe('removes an element from nested arrays', () => {

      it('found', () => {
        const input = freeze([['foo'], [[['bar'], 'baz']]])
        const output = unset(input, [1, 0, 1], 'baz')
        expect(output).to.deep.equal([['foo'], [[['bar']]]])
      })

      it('not found', () => {
        const input = freeze([['foo'], [[['bar'], 'baz']]])
        const output = unset(input, [1, 0, 1], 'qux')
        expect(output).to.deep.equal([['foo'], [[['bar'], 'baz']]])
      })

    })

    describe('removes properties from nested objects', () => {

      it('found', () => {
        const input = freeze({ foo: { bar: { baz: 'qux' } } })
        const output = unset(input, ['foo', 'bar', 'baz'], 'qux')
        expect(output).to.deep.equal({ foo: { bar: {} } })
      })

      it('not found', () => {
        const input = freeze({ foo: { bar: { baz: 'qux' } } })
        const output = unset(input, ['foo', 'bar', 'baz'], 'corge')
        expect(output).to.deep.equal({ foo: { bar: { baz: 'qux' } } })
      })

    })

    describe('bails if the path ends in undefined', () => {

      it('array', () => {
        const input = freeze([['foo'], [[['bar'], 'baz']]])
        const output = unset(input, [1, 1, 1], 'baz')
        expect(output).to.deep.equal([['foo'], [[['bar'], 'baz']]])
      })

      it('object', () => {
        const input = freeze({ foo: { bar: { baz: 'qux' } } })
        const output = unset(input, ['foo', 'bar', 'qux'], 'qux')
        expect(output).to.deep.equal({ foo: { bar: { baz: 'qux' } } })
      })

    })

  })

})
