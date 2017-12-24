import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, mountWith } from './__test__'
import * as Form from './form'
import * as Field from './field'

describe('Field.Model', () => {

  describe('state', () => {

    it('returns the state of the field', () => {
      const { state } = Field.Model.create(null)
      expect(state).to.deep.equal({
        init: null,
        value: null,
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

  })

  describe('update', () => {

    let form

    beforeEach(() => {
      form = { values: { foo: 'bar' }, patch: stub(), state: {} }
    })

    it('updates the field state through the form', () => {
      const field = Field.Model.create(form)
      form.patch.callsFake((_, ...args) => field.patch(...args))
      field.update({ value: 'foo' })
      expect(field.state).to.deep.equal({
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

    it('overrides the value being sent to the form', () => {
      const field = Field.Model.create(form, null, [], {
        override: (value, values) => {
          return values.foo === 'bar' ? 'baz' : value
        }
      })
      form.patch.callsFake((_, ...args) => field.patch(...args))
      field.update({ value: 'foo' })
      expect(field.state).to.deep.equal({
        init: null,
        value: 'baz',
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

    it('forces the values being sent to the form', () => {
      const field = Field.Model.create(form, void 0, [], {
        override: (value, values) => {
          return values.foo === 'bar' ? 'baz' : value
        }
      })
      form.patch.callsFake((_, ...args) => field.patch(...args))
      field.update({ value: 'foo' }, { force: true })
      expect(field.state).to.deep.equal({
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

  })

})

describe('Field.View', () => {

  let form
  let mount

  beforeEach(() => {
    form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('prop', () => {

    it('includes the field\'s name and current state', () => {
      const wrapper = mount(<Field.View name='test'/>)
      const { prop } = wrapper.instance()
      expect(prop).to.include({
        name: 'test',
        path: 'test',
        init: '',
        value: '',
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

    describe('isFocused', () => {

      it('true if the Form currently has focus on the field', () => {
        const wrapper = mount(<Field.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isFocused: false })
        form.state.focused = view.model
        expect(view.prop).to.include({ isFocused: true })
      })

    })

    describe('isPristine', () => {

      it('true if its current value shallow equals its intial value', () => {
        const wrapper = mount(<Field.View name='test' init={['foo', 'bar']}/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isPristine: true })
        view.setState({ value: ['foo', 'baz'] })
        expect(view.prop).to.include({ isPristine: false })
      })

    })

    describe('isDirty', () => {

      it('the opposite of isPristine', () => {
        const wrapper = mount(<Field.View name='test' init={['foo', 'bar']}/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({
          isDirty: false,
          isPristine: true
        })
        view.setState({ value: ['foo', 'baz'] })
        expect(view.prop).to.include({
          isDirty: true,
          isPristine: false
        })
      })

    })

  })

  describe('control', () => {

    it('models a form control', () => {
      const wrapper = mount(<Field.View name='test'/>)
      const { control } = wrapper.instance()
      expect(control).to.include({
        name: 'test',
        value: ''
      })
      expect(control.onBlur).to.be.a('function')
      expect(control.onFocus).to.be.a('function')
      expect(control.onChange).to.be.a('function')
    })

    it('has the id from its props', () => {
      const wrapper = mount(<Field.View id='foo' name='test'/>)
      const { control } = wrapper.instance()
      expect(control).to.include({ id: 'foo' })
    })

    it('has an id equal to its name when its id prop is true', () => {
      const wrapper = mount(<Field.View id name='test'/>)
      const { control } = wrapper.instance()
      expect(control).to.include({ id: 'test' })
    })

    it('is checkable when it is a checkbox', () => {
      const wrapper = mount(
        <Field.View name='test' component='input' type='checkbox'/>
      )
      const { control } = wrapper.instance()
      expect(control).to.include({ checked: false })
      expect(control).not.to.have.property('value')
    })

    it('is checked when it is a checkbox and its init is true', () => {
      const wrapper = mount(
        <Field.View
          name='test'
          init={true}
          component='input'
          type='checkbox'/>
      )
      const { control } = wrapper.instance()
      expect(control).to.include({ checked: true })
      expect(control).not.to.have.property('value')
    })

    it('is checkable when it is a radio button', () => {
      const wrapper = mount(
        <Field.View
          name='test'
          component='input'
          type='radio'
          value='foo'/>
      )
      const { control } = wrapper.instance()
      expect(control).to.include({
        value: 'foo',
        checked: false
      })
    })

  })

  describe('render', () => {

    it('passes field and control props to a render function', done => {
      const test = ({ field, control }) => {
        expect(field).to.be.an('object')
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(<Field.View name='test' render={test}/>)
    })

    it('passes field and control props to a child function', done => {
      const test = ({ field, control }) => {
        expect(field).to.be.an('object')
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(
        <Field.View name='test'>
          { test }
        </Field.View>
      )
    })

    it('passes field and control props to a component function', done => {
      const Test = ({ field, control }) => {
        expect(field).to.be.an('object')
        expect(control).to.be.an('object')
        done()
        return null
      }
      mount(<Field.View name='test' component={Test}/>)
    })

    it('spreads its control into the props of an element component', () => {
      const wrapper = mount(<Field.View name='test' component='input'/>)
      const input = wrapper.find('input')
      expect(input).to.have.prop('onBlur').that.is.a('function')
      expect(input).to.have.prop('onFocus').that.is.a('function')
      expect(input).to.have.prop('onChange').that.is.a('function')
    })

  })

  describe('onChange', () => {

  })

})
