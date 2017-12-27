import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mountWith } from './__test__'
import * as Form from './form'
import * as FieldArray from './field-array'

describe('FieldArray.Model', () => {

  describe('state', () => {

    it('is the state of the model', () => {
      const model = FieldArray.Model.create()
      expect(model.state).to.deep.equal({
        init: [],
        value: [],
        touches: 0,
        visits: 0,
        error: null,
        notice: null,
        isActive: false
      })
    })

  })

  describe('at', () => {

    it('returns the value in the model at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo'])
      expect(model.at(0)).to.equal('foo')
    })

  })

  describe('values', () => {

    it('is all values in the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      expect(model.values).to.deep.equal(['foo', 'bar'])
    })

  })

  describe('length', () => {

    it('is the length of the model\'s values', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      expect(model.length).to.equal(2)
    })

  })

  describe('insert', () => {

    it('inserts a value into the model at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo', 'baz'])
      model.root = model
      model.insert(1, 'bar')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('push', () => {

    it('appends a value to the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      model.root = model
      model.push('baz')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('unshift', () => {

    it('prepends a value to the model', () => {
      const model = FieldArray.Model.create(null, ['bar', 'baz'])
      model.root = model
      model.unshift('foo')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('remove', () => {

    it('removes a value from the model at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      model.root = model
      model.remove(1)
      expect(model.state).to.deep.include({
        init: ['foo', 'baz'],
        value: ['foo', 'baz']
      })
    })

  })

  describe('pop', () => {

    it('removes a value from the end of the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      model.root = model
      model.pop()
      expect(model.state).to.deep.include({
        init: ['foo', 'bar'],
        value: ['foo', 'bar']
      })
    })

  })

  describe('unshift', () => {

    it('removes a value from the beginning of the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      model.root = model
      model.shift()
      expect(model.state).to.deep.include({
        init: ['bar', 'baz'],
        value: ['bar', 'baz']
      })
    })

  })

  describe('clear', () => {

    it('removes all values from the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      model.root = model
      model.clear()
      expect(model.state).to.deep.include({
        init: [],
        value: []
      })
    })

  })

  describe('forEach', () => {

    it('calls a procedure for each value in the model', () => {
      const values = ['foo', 'bar']
      const model = FieldArray.Model.create(null, values)
      model.forEach((value, index, array) => {
        expect(value).to.equal(values[index])
        expect(array).to.equal(model)
      })
    })

  })

  describe('map', () => {

    it('applies a transform to the values in the model', () => {
      const values = ['foo', 'bar']
      const model = FieldArray.Model.create(null, values)
      const mapped = model.map((value, index, array) => {
        expect(value).to.equal(values[index])
        expect(array).to.equal(model)
        return value.toUpperCase()
      })
      expect(mapped).to.deep.equal(['FOO', 'BAR'])
    })

  })

})

describe('FieldArray.View', () => {

  let mount

  beforeEach(() => {
    const form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('render', () => {

    it('calls a render prop with a fields prop', done => {
      const test = ({ fields }) => {
        expect(fields).to.deep.include({
          name: 'test',
          path: 'test',
          init: ['foo', 'bar'],
          values: ['foo', 'bar'],
          length: 2,
          error: null,
          notice: null,
          anyTouched: false
        })
        expect(fields.at).to.be.a('function')
        expect(fields.insert).to.be.a('function')
        expect(fields.push).to.be.a('function')
        expect(fields.unshift).to.be.a('function')
        expect(fields.remove).to.be.a('function')
        expect(fields.pop).to.be.a('function')
        expect(fields.shift).to.be.a('function')
        expect(fields.clear).to.be.a('function')
        expect(fields.map).to.be.a('function')
        expect(fields.forEach).to.be.a('function')
        done()
        return null
      }
      mount(<FieldArray.View name='test' init={['foo', 'bar']} render={test}/>)
    })

  })

})
