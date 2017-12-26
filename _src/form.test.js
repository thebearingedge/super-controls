import { describe, it } from 'mocha'
import { expect, toRoute } from './__test__'
import * as Form from './form'
import * as Field from './field'
import * as FieldSet from './field-set'
import * as FieldArray from './field-array'

describe('Form.Model', () => {

  describe('register', () => {

    it('registers child fields', () => {
      const form = Form.Model.create('test', {})
      const field = form.register({
        init: '',
        route: toRoute('foo'),
        Model: Field.Model
      })
      expect(field).to.be.an.instanceOf(Field.Model)
      expect(form.fields.foo).to.equal(field)
      expect(form.state).to.deep.equal({
        blurs: 0,
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
      const first = form.register({
        init: '',
        route: toRoute('foo'),
        Model: Field.Model
      })
      const second = form.register({
        init: '',
        route: toRoute('foo'),
        Model: Field.Model
      })
      expect(first).to.be.an.instanceOf(Field.Model)
      expect(first).to.equal(second)
      expect(form.fields.foo).to.equal(first)
      expect(form.fields.foo).to.equal(second)
    })

    it('overrides initial values of child fields', () => {
      const form = Form.Model.create('test', { foo: [{ bar: 'baz' }] })
      const array = form.register({
        init: [],
        route: toRoute('foo'),
        Model: FieldArray.Model
      })
      const set = form.register({
        init: {},
        route: toRoute('foo[0]'),
        Model: FieldSet.Model
      })
      const field = form.register({
        init: '',
        route: toRoute('foo[0].bar'),
        Model: Field.Model
      })
      expect(array.state.value).to.deep.equal([{ bar: 'baz' }])
      expect(set.state.value).to.deep.equal({ bar: 'baz' })
      expect(field.state.value).to.equal('baz')
    })

  })

  describe('patch', () => {

    it('tracks focuses of descendant fields', () => {
      const form = Form.Model.create('test', {})
      form.register({ init: '', Model: Field.Model, route: toRoute('foo') })
      const field = form.getField(['foo'])
      form.patch(['foo'], { isFocused: field })
      expect(form).to.include({ focused: field })
    })

    it('tracks blurs of descendant fields', () => {
      const form = Form.Model.create('test', {})
      form.register({ init: '', Model: Field.Model, route: toRoute('foo') })
      const field = form.getField(['foo'])
      form.patch(['foo'], { isFocused: field })
      form.patch(['foo'], { isFocused: null })
      expect(form).to.include({ focused: null })
    })

  })

})

describe('Form.View', () => {

  describe('prop', () => {

  })

})
