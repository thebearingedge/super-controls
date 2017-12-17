import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, stub, toThunks } from './__test__'
import { Form } from './form'
import { modelField } from './field'
import { modelFieldSet } from './field-set'
import { modelFieldArray } from './field-array'

describe('Form', () => {

  describe('render', () => {

    it('renders a form element', () => {
      const wrapper = mount(<Form/>)
      expect(wrapper).to.have.tagName('form')
    })

  })

  describe('constructor', () => {

    it('has an initial state', () => {
      const form = mount(<Form/>).instance()
      expect(form.state).to.deep.equal({
        init: {},
        values: {},
        errors: {},
        notices: {},
        touched: {}
      })
    })

    it('reads its initial values from props', () => {
      const values = {
        foo: [
          { bar: '' },
          { bar: '' }
        ]
      }
      const form = mount(<Form init={values}/>).instance()
      expect(form.state).to.deep.equal({
        errors: {},
        notices: {},
        touched: {},
        values,
        init: values
      })
    })

  })

  describe('register', () => {

    it('registers fields by path', () => {
      const values = {
        foo: {
          bar: {
            baz: [{ qux: 'quux' }]
          }
        }
      }
      const form = mount(<Form init={values}/>).instance()
      form.register({
        model: modelFieldSet,
        paths: toThunks('foo')
      })
      form.register({
        model: modelFieldSet,
        paths: toThunks('foo.bar')
      })
      form.register({
        model: modelFieldArray,
        paths: toThunks('foo.bar.baz')
      })
      form.register({
        model: modelFieldSet,
        paths: toThunks('foo.bar.baz.0')
      })
      const field = form.register({
        model: modelField,
        paths: toThunks('foo.bar.baz.0.qux')
      })
      expect(field).to.deep.include({
        init: 'quux',
        value: 'quux',
        isTouched: false
      })
    })

    it('registers fields with intial values', () => {
      const form = mount(<Form/>).instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo'),
        init: 'foo'
      })
      expect(field).to.deep.include({
        init: 'foo',
        value: 'foo',
        isTouched: false
      })
      expect(form.state).to.deep.include({
        touched: {},
        init: { foo: 'foo' },
        values: { foo: 'foo' }
      })
    })

    it('receives value updates from fields', () => {
      const form = mount(<Form init={{ foo: '' }}/>).instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.update({ value: 'bar' })
      expect(form.state).to.deep.include({
        touched: {},
        init: { foo: '' },
        values: { foo: 'bar' }
      })
      expect(field).to.deep.include({
        init: '',
        value: 'bar',
        isTouched: false
      })
    })

    it('receives touch updates from fields', () => {
      const form = mount(<Form init={{ foo: '' }}/>).instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.update({ isTouched: true })
      expect(form.state).to.deep.equal({
        errors: {},
        notices: {},
        values: { foo: '' },
        init: { foo: '' },
        touched: { foo: true }
      })
      expect(field).to.deep.include({
        init: '',
        value: '',
        isTouched: true
      })
    })

    it('does not overwrite touched state for duplicate fields', () => {
      const form = mount(<Form init={{ foo: 'foo' }}/>).instance()
      const first = form.register({
        model: modelField,
        paths: toThunks('foo'),
        value: 'foo'
      })
      first.update({ isTouched: true })
      expect(first.isTouched).to.equal(true)
      const second = form.register({
        model: modelField,
        paths: toThunks('foo'),
        value: 'foo'
      })
      expect(second.isTouched).to.equal(true)
    })

  })

  describe('unregister', () => {

    it('unregisters fields by path', () => {
      const form = mount(<Form init={{ foo: 'bar' }}/>).instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.unregister()
      expect(form.state).to.deep.equal({
        init: {},
        values: {},
        errors: {},
        notices: {},
        touched: {}
      })
    })

    it('does not unregister fields that are not registered', () => {
      const form = mount(<Form init={{ foo: 'bar' }}/>).instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.unregister()
      field.unregister()
      expect(form.state).to.deep.equal({
        init: {},
        values: {},
        errors: {},
        notices: {},
        touched: {}
      })
    })

  })

  describe('onSubmit', () => {

    it('does nothing by default', () => {
      const wrapper = mount(<Form/>)
      expect(() => wrapper.simulate('submit')).not.to.throw()
    })

    it('calls a submit handler prop with its values', done => {
      const values = { foo: [{ bar: 'baz' }, { bar: 'qux' }] }
      const handleSubmit = submitted => {
        expect(submitted).not.to.equal(values)
        expect(submitted).to.deep.equal(values)
        done()
      }
      const wrapper = mount(
        <Form init={values} onSubmit={handleSubmit}/>
      )
      wrapper.simulate('submit')
    })

  })

  describe('onReset', () => {

    it('resets to its initial state', done => {
      class TestForm extends Form {
        componentDidUpdate() {}
      }
      const wrapper = mount(<TestForm/>)
      wrapper.setState({
        init: { foos: ['foo'] },
        touched: { foos: [true] },
        values: { foos: ['foo'] }
      }, _ => {
        stub(wrapper.instance(), 'componentDidUpdate')
          .callsFake(() => {
            expect(wrapper.state()).to.deep.equal({
              init: {},
              values: {},
              errors: {},
              notices: {},
              touched: {}
            })
            done()
          })
        wrapper.simulate('reset')
      })

    })

  })

})
