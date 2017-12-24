import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, mountWith } from './__test__'
import * as Form from './form'
import * as FieldArray from './field-array'

describe('FieldArray.Model', () => {

  let form

  beforeEach(() => {
    form = { patch: stub(), state: {} }
  })

  describe('state', () => {

    it('returns the state of the FieldArray', () => {
      const { state } = FieldArray.Model.create()
      expect(state).to.deep.equal({
        visits: 0,
        touched: [],
        visited: [],
        init: null,
        value: null,
        error: null,
        notice: null
      })
    })

  })

  describe('at', () => {

    it('returns the value in the FieldArray at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo'])
      expect(model.at(0)).to.equal('foo')
    })

  })

  describe('values', () => {

    it('all values in the fieldArray', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      expect(model.values).to.deep.equal(['foo', 'bar'])
    })

  })

  describe('length', () => {

    it('the length of the fieldArray values', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      expect(model.length).to.equal(2)
    })

  })

  describe('insert', () => {

    it('inserts a value into the fieldArray at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo', 'baz'])
      model.root = model
      model.insert(1, 'bar')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz'],
        touched: [void 0, void 0],
        visited: [void 0, void 0]
      })
    })

  })

  describe('push', () => {

    it('appends a value to the fieldArray', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      model.root = model
      model.push('baz')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz'],
        touched: [void 0, void 0, void 0],
        visited: [void 0, void 0, void 0]
      })
    })

  })

  describe('unshift', () => {

    it('prepends a value to the fieldArray', () => {
      const model = FieldArray.Model.create(null, ['bar', 'baz'])
      model.root = model
      model.unshift('foo')
      expect(model.state).to.deep.include({
        init: ['foo', 'bar', 'baz'],
        value: ['foo', 'bar', 'baz'],
        touched: [void 0],
        visited: [void 0]
      })
    })

  })

  describe('remove', () => {

    it('removes a value from the fieldArray at the given index', () => {
      const model = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
      model.root = model
      model.remove(1)
      expect(model.state).to.deep.include({
        init: ['foo', 'baz'],
        value: ['foo', 'baz']
      })
    })

  })

  describe('pop', () => {

    it('removes a value from the end of the fieldArray', () => {
      const model = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
      model.root = model
      model.pop()
      expect(model.state).to.deep.include({
        init: ['foo', 'bar'],
        value: ['foo', 'bar'],
        touched: [],
        visited: []
      })
    })

  })

  describe('unshift', () => {

    it('removes a value from the front of the fieldArray', () => {
      const model = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
      model.root = model
      model.shift()
      expect(model.state).to.deep.include({
        init: ['bar', 'baz'],
        value: ['bar', 'baz'],
        touched: [],
        visited: []
      })
    })

  })

  describe('clear', () => {

    it('removes all values from the fieldArray', () => {
      const model = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
      model.root = model
      model.clear()
      expect(model.state).to.deep.include({
        init: [],
        value: [],
        touched: [],
        visited: []
      })
    })

  })

  describe('forEach', () => {

    it('iterates over the values in the fieldArray', () => {
      const values = ['foo', 'bar']
      const model = FieldArray.Model.create(null, values)
      model.forEach((value, index, array) => {
        expect(value).to.equal(values[index])
        expect(array).to.equal(model)
      })
    })

  })

  describe('map', () => {

    it('applies a transform to the values in the fieldArray', () => {
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

    it('calls a render prop with a model prop', done => {
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
