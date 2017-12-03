import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, stub, toThunks } from './__test__'
import { Form } from './form'
import { modelField } from './field'

describe('Form', () => {

  describe('render', () => {

    it('renders a form element', () => {
      const wrapper = mount(<Form/>)
      expect(wrapper).to.have.tagName('form')
    })

  })

  describe('constructor', () => {

    it('has an initial state', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        init: {},
        values: {},
        touched: {}
      })
    })

    it('reads its initial values from props', () => {
      const values = { foo: '', bar: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        touched: {},
        values,
        init: values
      })
    })

    it('reads an intial nested values state', () => {
      const values = {
        foo: {
          bar: {
            baz: ''
          }
        }
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        touched: {},
        values,
        init: values
      })
    })

    it('reads an initial values state containing arrays', () => {
      const values = {
        foo: [
          { bar: '' },
          { bar: '' }
        ]
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
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
            baz: [{ qux: '' }]
          }
        }
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo.bar.baz.0.qux')
      })
      expect(field).to.deep.equal({
        init: '',
        value: '',
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('registers fields with intial values', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo'),
        init: 'foo'
      })
      expect(field).to.deep.equal({
        init: 'foo',
        value: 'foo',
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
      expect(form.state).to.deep.equal({
        values: { foo: 'foo' },
        init: { foo: 'foo' },
        touched: {}
      })
    })

    it('receives value updates from fields', () => {
      const values = { foo: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.update({ value: 'bar' })
      expect(form.state).to.deep.equal({
        values: { foo: 'bar' },
        init: { foo: '' },
        touched: {}
      })
      expect(field).to.deep.equal({
        init: '',
        value: 'bar',
        isTouched: false,
        isDirty: true,
        isPristine: false
      })
    })

    it('receives touch updates from fields', () => {
      const values = { foo: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.update({ isTouched: true })
      expect(form.state).to.deep.equal({
        values: { foo: '' },
        init: { foo: '' },
        touched: { foo: true }
      })
      expect(field).to.deep.equal({
        init: '',
        value: '',
        isTouched: true,
        isDirty: false,
        isPristine: true
      })
    })

    it('does not overwrite touched state for duplicate fields', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
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

    it('unregisters fields by path', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            init: {},
            values: {},
            touched: {}
          })
          done()
        }
      }
      const wrapper = mount(<TestForm values={{ foo: 'bar' }}/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.unregister()
    })

    it('does not unregister fields that are not registered', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            init: {},
            values: {},
            touched: {}
          })
          done()
        }
      }
      const wrapper = mount(<TestForm values={{ foo: 'bar' }}/>)
      const form = wrapper.instance()
      const field = form.register({
        model: modelField,
        paths: toThunks('foo')
      })
      field.unregister()
      field.unregister()
    })

  })

  describe('onSubmit', () => {

    it('does nothing by default', () => {
      const wrapper = mount(<Form/>)
      wrapper.simulate('submit')
    })

    it('calls a submit handler prop with its values', done => {
      const values = { foo: [{ bar: 'baz' }, { bar: 'qux' }] }
      const handleSubmit = submitted => {
        expect(submitted).not.to.equal(values)
        expect(submitted).to.deep.equal(values)
        done()
      }
      const wrapper = mount(
        <Form values={values} onSubmit={handleSubmit}/>
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
              touched: {}
            })
            done()
          })
        wrapper.simulate('reset')
      })

    })

  })

})
