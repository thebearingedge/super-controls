import { describe, beforeEach, it } from 'mocha'
import { expect, toRoute } from './__test__'
import * as Form from './form'
import * as Field from './field'
import * as FieldSet from './field-set'
import * as FieldArray from './field-array'

describe('Form.Model', () => {

  describe('register', () => {

    it('registers child fields', () => {
      const form = Form.Model.create('test', {})
      const field = form.register('', toRoute('foo'), Field.Model.create)
      expect(form.fields.foo).to.equal(field)
      expect(form.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: '' },
        value: { foo: '' },
        touched: { foo: false },
        visited: { foo: false }
      })
    })

    it('does not register a field more than once', () => {
      const form = Form.Model.create('test', {})
      const first = form.register('', toRoute('foo'), Field.Model.create)
      const second = form.register('', toRoute('foo'), Field.Model.create)
      expect(form.fields.foo).to.equal(first)
      expect(form.fields.foo).to.equal(second)
    })

    it('overrides initial values of child fields', () => {
      const form = Form.Model.create('test', { foo: [{ bar: 'baz' }] })
      const array = form.register([], toRoute('foo'), FieldArray.Model.create)
      const set = form.register({}, toRoute('foo.0'), FieldSet.Model.create)
      const field = form.register('', toRoute('foo.0.bar'), Field.Model.create)
      expect(array.state.value).to.deep.equal([{ bar: 'baz' }])
      expect(set.state.value).to.deep.equal({ bar: 'baz' })
      expect(field.state.value).to.equal('baz')
    })

  })

  describe('prop', () => {

    let form
    let prop

    beforeEach(() => {
      form = Form.Model.create('test', {})
      form.register([], toRoute('foo'), FieldArray.Model.create)
      form.register({}, toRoute('foo.0'), FieldSet.Model.create)
      form.register('', toRoute('foo.0.bar'), Field.Model.create)
      prop = form.prop
    })

    describe('change', () => {

      it('sets the value of the given field', () => {
        expect(form.state).to.deep.include({
          value: { foo: [{ bar: '' }] }
        })
        prop.change('foo[0].bar', 'qux')
        expect(form.state).to.deep.include({
          value: { foo: [{ bar: 'qux' }] }
        })
      })

    })

    describe('touch', () => {

      it('marks the given field as touched', () => {
        expect(form.state).to.deep.include({
          touched: { foo: [{ bar: false }] }
        })
        prop.touch('foo[0].bar')
        expect(form.state).to.deep.include({
          touched: { foo: [{ bar: true }] }
        })
      })

    })

    describe('untouch', () => {

      it('unmarks the given field as touched', () => {
        prop.touch('foo[0].bar')
        expect(form.state).to.deep.include({
          touched: { foo: [{ bar: true }] }
        })
        prop.untouch('foo[0].bar')
        expect(form.state).to.deep.include({
          touched: { foo: [{ bar: false }] }
        })
      })

    })

  })

})
