import { describe, beforeEach, it } from 'mocha'
import { expect, stub, toRoute } from './__test__'
import * as Field from './field'
import * as FieldArray from './field-array'

describe('FieldArray.Model', () => {

  let form

  beforeEach(() => {
    form = { update: stub(), state: {} }
  })

  describe('state', () => {

    it('returns the state of the fieldArray', () => {
      const { state } = FieldArray.Model.create(form)
      expect(state).to.deep.equal({
        visits: 0,
        touched: [],
        visited: [],
        error: null,
        notice: null,
        init: void 0,
        value: void 0
      })
    })

  })

  describe('register', () => {

    it('registers a child field', () => {
      const fieldArray = FieldArray.Model.create(form, [])
      const field = Field.Model.create(form, '', toRoute('0'))
      fieldArray.register(field.names, field)
      expect(fieldArray.fields[0]).to.equal(field)
    })

    it('registers a child fieldArray', () => {
      const parent = FieldArray.Model.create(form, {})
      const child = FieldArray.Model.create(form, {}, toRoute('0'))
      parent.register(child.names, child)
      expect(parent.fields[0]).to.equal(child)
    })

    it('registers a grandchild field', () => {
      const parent = FieldArray.Model.create(form, {})
      const child = FieldArray.Model.create(form, {}, toRoute('0'))
      const grandchild = Field.Model.create(form, {}, toRoute('0.0'))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.fields[0].fields[0]).to.equal(grandchild)
    })

  })

  describe('unregister', () => {

    it('unregisters a child field', () => {
      const fieldArray = FieldArray.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('0'))
      form.update.callsFake((...args) => fieldArray.update(...args))
      fieldArray.register(field.names, field)
      expect(fieldArray.fields[0]).to.equal(field)
      fieldArray.unregister(field.names)
      expect(fieldArray.fields[0]).to.equal(void 0)
    })

  })

  describe('update', () => {

    it('updates its state with a child\'s state', () => {
      const fieldArray = FieldArray.Model.create(form, [])
      const field = Field.Model.create(form, 'foo', toRoute('0'))
      form.update.callsFake((...args) => fieldArray.update(...args))
      fieldArray.register(field.names, field)
      expect(fieldArray.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: ['foo'],
        value: ['foo'],
        touched: [false],
        visited: [false]
      })
    })

    it('tracks visits of child fields', () => {
      const fieldArray = FieldArray.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('0'))
      form.update.callsFake((...args) => fieldArray.update(...args))
      fieldArray.register(field.names, field)
      field.prop.update({ isFocused: true })
      expect(fieldArray.state).to.include({
        visits: 1
      })
    })

  })

  describe('prop', () => {

    describe('anyTouched', () => {

      it('true if any of the fieldSet\'s child fields are touched', () => {
        const parent = FieldArray.Model.create(form, {})
        const child = FieldArray.Model.create(form, {}, toRoute('0'))
        const grandchild = Field.Model.create(form, {}, toRoute('0.0'))
        form.update.callsFake((...args) => parent.update(...args))
        parent
          .register(child.names, child)
          .register(grandchild.names, grandchild)
        expect(parent.prop).to.include({ anyTouched: false })
        parent.update(grandchild.names, { isTouched: true })
        expect(parent.prop).to.include({ anyTouched: true })
      })

    })

    describe('at', () => {

      it('returns the value in the fieldArray at the given index', () => {
        const { prop } = FieldArray.Model.create(form, ['foo'])
        expect(prop.at(0)).to.equal('foo')
      })

    })

    describe('values', () => {

      it('all values in the fieldArray', () => {
        const { prop } = FieldArray.Model.create(form, ['foo', 'bar'])
        expect(prop.values).to.deep.equal(['foo', 'bar'])
      })

    })

    describe('length', () => {

      it('the length of the fieldArray values', () => {
        const { prop } = FieldArray.Model.create(form, ['foo', 'bar'])
        expect(prop.length).to.deep.equal(2)
      })

    })

    describe('forEach', () => {

      it('iterates over the values in the fieldArray', () => {
        const values = ['foo', 'bar']
        const { prop } = FieldArray.Model.create(form, values)
        prop.forEach((value, index, array) => {
          expect(value).to.equal(values[index])
          expect(array).to.equal(prop)
        })
      })

    })

    describe('map', () => {

      it('applies a transform to the values in the fieldArray', () => {
        const values = ['foo', 'bar']
        const { prop } = FieldArray.Model.create(form, values)
        const mapped = prop.map((value, index, array) => {
          expect(value).to.equal(values[index])
          expect(array).to.equal(prop)
          return value.toUpperCase()
        })
        expect(mapped).to.deep.equal(['FOO', 'BAR'])
      })

    })

    describe('insert', () => {

      it('inserts a value into the fieldArray at the given index', () => {
        const array = FieldArray.Model.create(form, ['foo', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.insert(1, 'bar')
        expect(array.state).to.deep.include({
          init: ['foo', 'bar', 'baz'],
          value: ['foo', 'bar', 'baz'],
          touched: [void 0, void 0],
          visited: [void 0, void 0]
        })
      })

    })

    describe('push', () => {

      it('appends a value to the fieldArray', () => {
        const array = FieldArray.Model.create(form, ['foo', 'bar'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.push('baz')
        expect(array.state).to.deep.include({
          init: ['foo', 'bar', 'baz'],
          value: ['foo', 'bar', 'baz'],
          touched: [void 0, void 0, void 0],
          visited: [void 0, void 0, void 0]
        })
      })

    })

    describe('unshift', () => {

      it('prepends a value to the fieldArray', () => {
        const array = FieldArray.Model.create(form, ['bar', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.unshift('foo')
        expect(array.state).to.deep.include({
          init: ['foo', 'bar', 'baz'],
          value: ['foo', 'bar', 'baz'],
          touched: [void 0],
          visited: [void 0]
        })
      })

    })

    describe('remove', () => {

      it('removes a value from the fieldArray at the given index', () => {
        const array = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.remove(1)
        expect(array.state).to.deep.include({
          init: ['foo', 'baz'],
          value: ['foo', 'baz']
        })
      })

    })

    describe('pop', () => {

      it('removes a value from the end of the fieldArray', () => {
        const array = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.pop()
        expect(array.state).to.deep.include({
          init: ['foo', 'bar'],
          value: ['foo', 'bar'],
          touched: [],
          visited: []
        })
      })

    })

    describe('unshift', () => {

      it('removes a value from the front of the fieldArray', () => {
        const array = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.shift()
        expect(array.state).to.deep.include({
          init: ['bar', 'baz'],
          value: ['bar', 'baz'],
          touched: [],
          visited: []
        })
      })

    })

    describe('clear', () => {

      it('removes all values from the fieldArray', () => {
        const array = FieldArray.Model.create(form, ['foo', 'bar', 'baz'])
        form.update.callsFake((...args) => array.update(...args))
        array.prop.clear()
        expect(array.state).to.deep.include({
          init: [],
          value: [],
          touched: [],
          visited: []
        })
      })

    })

  })

})
