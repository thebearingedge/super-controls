import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, mountWith } from './__test__'
import * as Form from './form'
import * as Field from './field'

describe('Field.Model', () => {

  describe('state', () => {

    it('is the state of the field', () => {
      const model = Field.Model.create()
      expect(model.state).to.deep.equal({
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

    it('patches the field state through the form', () => {
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

    it('forces the value being sent to the form', () => {
      const field = Field.Model.create(form, null, [], {
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

  describe('init', () => {

    it('is a String by default', () => {
      const wrapper = mount(<Field.View name='test'/>)
      const view = wrapper.instance()
      expect(view.init).to.equal('')
    })

    it('is a Boolean when its component is a checkbox', () => {
      const wrapper = mount(
        <Field.View name='test' component='input' type='checkbox'/>
      )
      const view = wrapper.instance()
      expect(view.init).to.equal(false)
    })

    it('is an Array when its component is a multiple select', () => {
      const wrapper = mount(
        <Field.View name='test' component='select' multiple/>
      )
      const view = wrapper.instance()
      expect(view.init).to.deep.equal([])
    })

  })

  describe('getValue', () => {

    it('returns the form control value', () => {
      const wrapper = mount(<Field.View name='test' component='input'/>)
      const value = wrapper.instance().getValue({ target: { value: 'foo' } })
      expect(value).to.equal('foo')
    })

    it('returns a boolean when the component is a checkbox', () => {
      const wrapper = mount(
        <Field.View name='test' component='input' type='checkbox'/>
      )
      const value = wrapper.instance().getValue({ target: { checked: true } })
      expect(value).to.equal(true)
    })

    it('returns an array when the component is a multiple select', () => {
      const wrapper = mount(
        <Field.View name='test' component='select' multiple>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </Field.View>
      )
      wrapper.find('[value="foo"]').getDOMNode().selected = true
      wrapper.find('[value="baz"]').getDOMNode().selected = true
      const select = wrapper.getDOMNode()
      const value = wrapper.instance().getValue({ target: select })
      expect(value).to.deep.equal(['foo', 'baz'])
    })

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

      it('is true if the Form currently has focus on the field', () => {
        const wrapper = mount(<Field.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isFocused: false })
        form.focused = view.model
        expect(view.prop).to.include({ isFocused: true })
      })

    })

    describe('isPristine', () => {

      it('is true if its value shallow equals its intial value', () => {
        const wrapper = mount(<Field.View name='test' init={['foo', 'bar']}/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isPristine: true })
        view.setState({ value: ['foo', 'baz'] })
        expect(view.prop).to.include({ isPristine: false })
      })

    })

    describe('isDirty', () => {

      it('is the opposite of isPristine', () => {
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

  describe('createControl', () => {

    it('models a form control', done => {
      const test = ({ control }) => {
        expect(control).to.include({
          name: 'test',
          value: ''
        })
        expect(control.onBlur).to.be.a('function')
        expect(control.onFocus).to.be.a('function')
        expect(control.onChange).to.be.a('function')
        done()
        return null
      }
      mount(<Field.View name='test' render={test}/>)
    })

    it('is checkable when it is a checkbox', () => {
      const wrapper = mount(
        <Field.View name='test' component='input' type='checkbox' init={true}/>
      )
      expect(wrapper).to.be.checked()
    })

    it('is checkable when it is a radio button', () => {
      const wrapper = mount(
        <Field.View
          name='test'
          component='input'
          type='radio'
          value='foo'
          init='foo'/>
      )
      expect(wrapper).to.be.checked()
    })

    describe('onBlur', () => {

      it('sets the field as touched', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        const { model } = wrapper.instance()
        expect(model.state).to.include({ isTouched: false })
        expect(wrapper).to.have.state('isTouched', false)
        wrapper.simulate('blur')
        expect(model.state).to.include({ isTouched: true })
        expect(wrapper).to.have.state('isTouched', true)
        expect(form).to.include({ focused: null })
      })

    })

    describe('onFocus', () => {

      it('sets the fields\'s isFocused and isVisited state', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        const { model } = wrapper.instance()
        expect(model).to.include({ isFocused: false })
        expect(model.state).to.include({ isVisited: false })
        expect(wrapper.state()).to.include({
          isFocused: false,
          isVisited: false
        })
        wrapper.simulate('focus')
        expect(model).to.include({ isFocused: true })
        expect(model.state).to.include({ isVisited: true })
        expect(form).to.include({ focused: model })
      })

    })

    describe('onChange', () => {

      it('sets the field\'s value state', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        const { model } = wrapper.instance()
        expect(model.state).to.include({ value: '' })
        wrapper.simulate('change', { target: { value: 'test' } })
        expect(model.state).to.include({ value: 'test' })
      })

    })

  })

  describe('props', () => {

    describe('parse', () => {

      it('parses the value from the control', () => {
        const wrapper = mount(
          <Field.View
            name='test'
            type='date'
            component='input'
            parse={value => new Date(value)}/>
        )
        wrapper.simulate('change', { target: { value: '1970-01-01' } })
        expect(wrapper)
          .to.have.state('value')
          .that.is.a('date')
      })

    })

    describe('format', () => {

      it('formats the value from the field state', () => {
        const format = value => {
          if (!value) return ''
          const year = value.getFullYear()
          const month = `${value.getMonth() + 1}`.padStart(2, 0)
          const day = `${value.getDate()}`.padStart(2, 0)
          return `${year}-${month}-${day}`
        }
        const wrapper = mount(
          <Field.View
            name='test'
            type='date'
            component='input'
            format={format}
            init={new Date('1/1/1970')}/>
        )
        expect(wrapper).to.have.value('1970-01-01')
      })

    })

    describe('override', () => {

      it('sets the field model\'s override method', () => {
        const override = _ => _
        const wrapper = mount(<Field.View name='test' override={override}/>)
        const { model } = wrapper.instance()
        expect(model).to.include({ override })
      })

    })

    describe('onBlur', () => {

      it('intercepts blur events', done => {
        class TestField extends Field.View {
          componentDidUpdate() {
            done(new Error('default not prevented'))
          }
        }
        const test = (event, field) => {
          event.preventDefault()
          expect(field.isTouched).to.equal(false)
          done()
        }
        const wrapper = mount(
          <TestField name='test' onBlur={test} component='input'/>
        )
        wrapper.simulate('blur')
      })

    })

    describe('onFocus', () => {

      it('intercepts focus events', done => {
        class TestField extends Field.View {
          componentDidUpdate() {
            done(new Error('default not prevented'))
          }
        }
        const test = (event, field) => {
          event.preventDefault()
          expect(field.isFocused).to.equal(false)
          done()
        }
        const wrapper = mount(
          <TestField name='test' onFocus={test} component='input'/>
        )
        wrapper.simulate('focus')
      })

    })

    describe('onChange', () => {

      it('intercepts change events', done => {
        class TestField extends Field.View {
          componentDidUpdate() {
            done(new Error('default not prevented'))
          }
        }
        const test = (event, nextValue, field) => {
          event.preventDefault()
          expect(nextValue).to.equal('foo')
          expect(field.value).to.equal('')
          done()
        }
        const wrapper = mount(
          <TestField name='test' onChange={test} component='input'/>
        )
        wrapper.simulate('change', { target: { value: 'foo' } })
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

    it('spreads its control into the props of a tagName component', () => {
      const wrapper = mount(<Field.View name='test' component='input'/>)
      const input = wrapper.find('input')
      expect(input).to.have.prop('onBlur').that.is.a('function')
      expect(input).to.have.prop('onFocus').that.is.a('function')
      expect(input).to.have.prop('onChange').that.is.a('function')
    })

  })

})
