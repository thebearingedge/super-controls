import React from 'react'
import { describe, it } from 'mocha'
import { expect, mount, stub, toRoute } from './__test__'
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
      expect(form.getState()).to.deep.include({
        error: null,
        notice: null,
        active: null,
        isActive: false,
        anyVisited: false,
        anyTouched: false,
        isSubmitting: false,
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
      expect(array.getState()).to.deep.include({
        init: [{ bar: 'baz' }],
        values: [{ bar: 'baz' }]
      })
      expect(set.getState()).to.deep.include({
        init: { bar: 'baz' },
        values: { bar: 'baz' }
      })
      expect(field.getState()).to.include({
        init: 'baz',
        value: 'baz'
      })
    })

  })

  describe('submit', () => {

    it('calls the models onSubmit method with its values', done => {
      const form = Form.Model.create('test', {}, {
        onSubmit(errors, values, model) {
          expect(errors).to.equal(null)
          expect(values).to.equal(form.values)
          expect(model).to.equal(form)
          done()
        }
      })
      form.submit()
    })

    it('calls the model\'s onSubmit method with its errors', done => {
      const form = Form.Model.create('test', {}, {
        validate(values) {
          return !Object.keys(values).length && { error: 'incomplete' }
        },
        onSubmit(errors, values, model) {
          expect(errors).to.deep.equal({
            $self: 'incomplete'
          })
          expect(values).to.equal(form.values)
          expect(model).to.equal(form)
          done()
        }
      })
      form.submit()
    })

    it('forwards promise rejections from within its onSubmit', done => {
      const err = new Error('Oops!')
      const form = Form.Model.create('test', {}, {
        onSubmit() {
          throw err
        }
      })
      form
        .submit()
        .catch(_err => {
          expect(_err).to.equal(err)
          done()
        })
    })

  })

})

describe('Form.View', () => {

  describe('render', () => {

    it('renders a form element by default', () => {
      const wrapper = mount(<Form.View/>)
      expect(wrapper).to.have.tagName('form')
    })

    it('passes name, onReset, and onSubmit props to the form element', () => {
      const wrapper = mount(<Form.View name='test'/>)
      const { handleReset, handleSubmit } = wrapper.instance()
      const form = wrapper.find('form')
      expect(form).to.have.props({
        name: 'test',
        onReset: handleReset,
        onSubmit: handleSubmit
      })
    })

    it('passes form and control props to a render function', done => {
      const test = ({ form, control }) => {
        expect(form).to.be.an.instanceOf(Form.Model)
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(<Form.View name='test' render={test}/>)
    })

    it('passes form and control props to a component function', done => {
      const test = ({ form, control }) => {
        expect(form).to.be.an.instanceOf(Form.Model)
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(<Form.View name='test' component={test}/>)
    })

    it('passes form and control props to a child function', done => {
      const test = ({ form, control }) => {
        expect(form).to.be.an.instanceOf(Form.Model)
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(
        <Form.View name='test'>
          { test }
        </Form.View>
      )
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

  describe('control', () => {

    describe('onReset', () => {

      it('resets the form to its initial state', () => {
        const wrapper = mount(
          <Form.View name='test' init={{ foo: 'bar' }}>
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

    describe('onSubmit', () => {
      it('prevents the default submit event behavior', () => {
        const wrapper = mount(<Form.View name='test'/>)
        const event = { preventDefault: stub() }
        wrapper.simulate('submit', event)
        expect(event.preventDefault).to.have.callCount(1)
      })

    })

  })

  describe('props', () => {

    describe('onReset', () => {

      it('intercepts reset events', done => {
        class TestForm extends Form.View {
          componentWillMount() {
            super.componentWillMount()
            this.setState({ value: { foo: 'bar' } })
          }
          componentDidUpdate() {
            done(new Error('default not prevented'))
          }
        }
        const test = (event, form) => {
          event.preventDefault()
          expect(form).to.be.an.instanceOf(Form.Model)
          done()
        }
        const wrapper = mount(
          <TestForm name='test' onReset={test}/>
        )
        wrapper.simulate('reset')
      })

    })

  })

})
