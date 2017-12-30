import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mountWith } from './__test__'
import * as Form from './form'
import * as FieldArray from './field-array'

describe('FieldArray.Model', () => {

  describe('getState', () => {

    describe('length', () => {

      it('is the length of the model\'s value state', () => {
        const model = FieldArray.Model.create(null)
        model.root = model
        expect(model.getState()).to.include({ length: 0 })
        model.patch([], { value: ['foo', 'bar'] })
        expect(model.getState()).to.include({ length: 2 })
      })

    })

  })

  describe('at', () => {

    it('returns the value in the model at the given index', () => {
      const model = FieldArray.Model.create(null, ['foo'])
      expect(model.at(0)).to.equal('foo')
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

    it('applies a transform to the keys in the model', () => {
      const values = ['foo', 'bar']
      const model = FieldArray.Model.create(null, values)
      const mapped = model.map((value, index, array, key) => {
        expect(value).to.equal(values[index])
        expect(array).to.equal(model)
        expect(key).to.be.a('number')
        return value.toUpperCase()
      })
      expect(mapped).to.deep.equal(['FOO', 'BAR'])
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

})

describe('FieldArray.View', () => {

  let mount

  beforeEach(() => {
    const form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('prop', () => {

    it('includes the model\'s state and methods', () => {
      const wrapper = mount(<FieldArray.View name='test'/>)
      const { model, prop } = wrapper.instance()
      expect(prop).to.include(model.getState())
      expect(prop.at).to.be.a('function')
      expect(prop.insert).to.be.a('function')
      expect(prop.push).to.be.a('function')
      expect(prop.unshift).to.be.a('function')
      expect(prop.remove).to.be.a('function')
      expect(prop.pop).to.be.a('function')
      expect(prop.shift).to.be.a('function')
      expect(prop.clear).to.be.a('function')
      expect(prop.touch).to.be.a('function')
      expect(prop.change).to.be.a('function')
      expect(prop.untouch).to.be.a('function')
      expect(prop.touchAll).to.be.a('function')
      expect(prop.untouchAll).to.be.a('function')
    })

  })

  describe('render', () => {

    it('calls a render prop with a fields prop', done => {
      const test = ({ fields }) => {
        expect(fields).to.be.an('object')
        done()
        return null
      }
      mount(<FieldArray.View name='test' render={test}/>)
    })

  })

})
