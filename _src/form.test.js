import React from 'react'
import { describe, it } from 'mocha'
import { expect, mount, toRoute } from './__test__'
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
        touches: 0,
        visits: 0,
        error: null,
        notice: null,
        active: null,
        isActive: false,
        init: { foo: '' },
        value: { foo: '' }
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
      form.patch(['foo'], { visits: 1 })
      expect(form.state).to.include({ active: field })
    })

    it('tracks touches of descendant fields', () => {
      const form = Form.Model.create('test', {})
      form.register({ init: '', Model: Field.Model, route: toRoute('foo') })
      const field = form.getField(['foo'])
      form.patch(['foo'], { visits: 1 })
      expect(form.state).to.include({ active: field })
      form.patch(['foo'], { touches: 1 })
      expect(form.state).to.include({ active: null })
    })

  })

})

describe('Form.View', () => {

  describe('render', () => {

    it('renders a form element by default', () => {
      const wrapper = mount(<Form.View/>)
      expect(wrapper).to.have.tagName('form')
    })

  })

  describe('register', () => {

    it('registers descendant fields', () => {
      const wrapper = mount(
        <Form.View init={{ foo: { bar: [''] } }}>
          <FieldSet.View name='foo'>
            <FieldArray.View name='bar'>
              <Field.View name={0}/>
            </FieldArray.View>
          </FieldSet.View>
        </Form.View>
      )
      const { model } = wrapper.instance()
      expect(model.fields.foo.fields.bar.fields[0])
        .to.be.an.instanceOf(Field.Model)
    })

  })

  describe('createControl', () => {

    describe('onReset', () => {

      it('resets the form to its initial state', () => {
        const wrapper = mount(
          <Form.View init={{ foo: 'bar' }}>
            <Field.View name='foo' component='input'/>
          </Form.View>
        )
        const input = wrapper.find('input').hostNodes()
        input.simulate('change', { target: { value: 'baz' } })
        const { model } = wrapper.instance()
        expect(model.getState()).to.deep.include({
          init: { foo: 'bar' },
          values: { foo: 'baz' }
        })
        const form = wrapper.find('form')
        form.simulate('reset')
        expect(model.getState()).to.deep.include({
          init: { foo: 'bar' },
          values: { foo: 'bar' }
        })
      })

    })

  })

  describe('prop', () => {

    describe('name', () => {

      it('is the name prop of the form', () => {
        const wrapper = mount(<Form.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ name: 'test' })
      })
    })

  })

})
