import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mountWith, toRoute } from './__test__'
import * as Form from './form'
import * as Field from './field'
import * as FieldSet from './field-set'
import * as FieldArray from './field-array'

describe('FieldArray.Model', () => {

  describe('getState', () => {

    describe('length', () => {

      it('is the length of the model\'s value state', () => {
        const model = FieldArray.Model.create(null)
        model.form = model
        expect(model.getState()).to.include({ length: 0 })
        model._patch([], { value: ['foo', 'bar'] })
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

    it('applies a transform to the values in the model', () => {
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
      model.form = model
      model.insert(1, 'bar')
      expect(model.getState()).to.deep.include({
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('push', () => {

    it('appends a value to the model', () => {
      const model = FieldArray.Model.create(null, ['foo', 'bar'])
      model.form = model
      model.push('baz')
      expect(model.getState()).to.deep.include({
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('unshift', () => {

    it('prepends a value to the model', () => {
      const model = FieldArray.Model.create(null, ['bar', 'baz'])
      model.form = model
      model.unshift('foo')
      expect(model.getState()).to.deep.include({
        value: ['foo', 'bar', 'baz']
      })
    })

  })

  describe('remove', () => {

    it('removes a value from the model at the given index', () => {
      const array = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      array.form = array
      array
        .register([0], Field.Model.create(array, 'foo', toRoute('0')))
        .register([1], Field.Model.create(array, 'bar', toRoute('1')))
        .register([2], Field.Model.create(array, 'baz', toRoute('2')))
      array.remove(1)
      expect(array.getState()).to.deep.include({
        value: ['foo', 'baz']
      })
    })

  })

  describe('pop', () => {

    it('removes a value from the end of the model', () => {
      const array = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      array.form = array
      array
        .register([0], Field.Model.create(array, 'foo', toRoute('0')))
        .register([1], Field.Model.create(array, 'bar', toRoute('1')))
        .register([2], Field.Model.create(array, 'baz', toRoute('2')))
      array.pop()
      expect(array.getState()).to.deep.include({
        value: ['foo', 'bar']
      })
    })

  })

  describe('shift', () => {

    it('removes a value from the beginning of the model', () => {
      const array = FieldArray.Model.create(null, ['foo', 'bar', 'baz'])
      array.form = array
      array
        .register([0], Field.Model.create(array, 'foo', toRoute('0')))
        .register([1], Field.Model.create(array, 'bar', toRoute('1')))
        .register([2], Field.Model.create(array, 'baz', toRoute('2')))
      array.shift()
      expect(array.getState()).to.deep.include({
        value: ['bar', 'baz']
      })
    })

  })

  describe('clear', () => {

    it('removes all values and fields from the model', () => {
      const array = FieldArray.Model.create()
      array.form = array
      array
        .register([0], Field.Model.create(array, 'foo', toRoute('[0]')))
        .register([1], Field.Model.create(array, 'bar', toRoute('[1]')))
        .register([2], Field.Model.create(array, 'baz', toRoute('[2]')))
      expect(array.fields).to.have.lengthOf(3)
      expect(array.values).to.deep.equal(['foo', 'bar', 'baz'])
      array.clear()
      expect(array.fields).to.have.lengthOf(0)
      expect(array.values).to.deep.equal([])
    })

  })

  describe('initialize', () => {

    it('patches the init and value states of itself', () => {
      const model = FieldArray.Model.create(null, [])
      model.form = model
      model.initialize(['foo'])
      expect(model.getState()).to.deep.include({
        init: ['foo'],
        values: ['foo']
      })
    })

    it('patches the init and value states of its descendants', () => {
      const parent = FieldArray.Model.create(null, [])
      parent.form = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('[0]'))
      const grandchild = Field.Model.create(parent, '', toRoute('[0].foo'))
      parent
        .register([0], child)
        .register([0, 'foo'], grandchild)
      parent.initialize([{ foo: 'bar' }])
      expect(parent.getState()).to.deep.include({
        init: [{ foo: 'bar' }],
        values: [{ foo: 'bar' }]
      })
      expect(child.getState()).to.deep.include({
        init: { foo: 'bar' },
        values: { foo: 'bar' }
      })
      expect(grandchild.getState()).to.include({
        init: 'bar',
        value: 'bar'
      })
    })

    it('unregisters fields that have no corresponding init state', () => {
      const fieldArray = FieldArray.Model.create(null, ['foo'])
      fieldArray.form = fieldArray
      const first = Field.Model.create(fieldArray, 'foo', toRoute('[0]'))
      const second = Field.Model.create(fieldArray, 'bar', toRoute('[1]'))
      fieldArray
        .register([0], first)
        .register([1], second)
      expect(fieldArray.fields[1]).to.equal(second)
      fieldArray.initialize(['foo'])
      expect(fieldArray.fields[1]).to.equal(void 0)
    })

  })

  describe('reset', () => {

    it('resets the state of the model and its descendants', () => {
      const array = FieldArray.Model.create(null, [])
      array.form = array
      const set = FieldSet.Model.create(array, {}, toRoute('[0]'))
      const field = Field.Model.create(array, '', toRoute('[0].foo'))
      array
        .register([0], set)
        .register([0, 'foo'], field)
      array.change('[0].foo', 'bar')
      expect(array.getState()).to.deep.include({
        init: [{ foo: '' }],
        values: [{ foo: 'bar' }]
      })
      expect(set.getState()).to.deep.include({
        init: { foo: '' },
        values: { foo: 'bar' }
      })
      expect(field.getState()).to.include({
        init: '',
        value: 'bar'
      })
      array.reset()
      expect(array.getState()).to.deep.include({
        init: [{ foo: '' }],
        values: [{ foo: '' }]
      })
      expect(set.getState()).to.deep.include({
        init: { foo: '' },
        values: { foo: '' }
      })
      expect(field.getState()).to.include({
        init: '',
        value: ''
      })
    })

    it('retains the active state of itself and active descendants', () => {
      const array = FieldArray.Model.create(null, [])
      array.form = array
      const set = FieldSet.Model.create(array, {}, toRoute('[0]'))
      const field = Field.Model.create(array, '', toRoute('[0].foo'))
      array
        .register([0], set)
        .register([0, 'foo'], field)
      field.visit()
      expect(array.getState()).to.deep.include({
        isActive: true,
        anyVisited: true
      })
      expect(set.getState()).to.deep.include({
        isActive: true,
        anyVisited: true
      })
      expect(field.getState()).to.include({
        isActive: true,
        isVisited: true
      })
      array.reset()
      expect(array.getState()).to.deep.include({
        isActive: true,
        anyVisited: false
      })
      expect(set.getState()).to.deep.include({
        isActive: true,
        anyVisited: false
      })
      expect(field.getState()).to.include({
        isActive: true,
        isVisited: false
      })
    })

    it('unregisters fields that were registered after initialization', () => {
      const fieldArray = FieldArray.Model.create(null, ['foo'])
      fieldArray.form = fieldArray
      const first = Field.Model.create(fieldArray, 'foo', toRoute('[0]'))
      fieldArray.register([0], first)
      fieldArray.isInitialized = true
      const second = Field.Model.create(fieldArray, 'bar', toRoute('[1]'))
      fieldArray.register([1], second)
      expect(fieldArray.fields[1]).to.equal(second)
      fieldArray.reset()
      expect(fieldArray.fields[1]).to.equal(void 0)
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

    it('passes a fields prop to a render function', done => {
      const test = ({ fields }) => {
        expect(fields).to.be.an.instanceOf(FieldArray.Model)
        done()
        return null
      }
      mount(<FieldArray.View name='test' render={test}/>)
    })

    it('passes a fields prop to a component function', done => {
      const test = ({ fields }) => {
        expect(fields).to.be.an.instanceOf(FieldArray.Model)
        done()
        return null
      }
      mount(<FieldArray.View name='test' component={test}/>)
    })

    it('passes a fields prop to a child function', done => {
      const test = ({ fields }) => {
        expect(fields).to.be.an.instanceOf(FieldArray.Model)
        done()
        return null
      }
      mount(
        <FieldArray.View name='test'>
          { test }
        </FieldArray.View>
      )
    })

  })

})
