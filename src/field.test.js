import React, { Component } from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, mountWith } from './__test__'
import * as Form from './form'
import * as Field from './field'

describe('Field.Model', () => {

  let form

  beforeEach(() => {
    form = { state: {}, _patch: stub(), values: { foo: 'bar' } }
  })

  describe('change', () => {

    it('patches the field\'s value state through the form', () => {
      const field = Field.Model.create(form)
      form._patch.callsFake((_, ...args) => field._patch(...args))
      expect(field.getState()).to.include({ value: null })
      field.change('foo')
      expect(field.getState()).to.include({ value: 'foo' })
    })

    it('overrides the value state being sent to the form', () => {
      const field = Field.Model.create(form, null, void 0, {
        override: (value, values) => {
          return values.foo === 'bar' ? 'baz' : value
        }
      })
      form._patch.callsFake((_, ...args) => field._patch(...args))
      field.change('foo')
      expect(field.getState()).to.include({ value: 'baz' })
    })

    it('forces the value state being sent to the form', () => {
      const field = Field.Model.create(form, null, void 0, {
        override: (value, values) => {
          return values.foo === 'bar' ? 'baz' : value
        }
      })
      form._patch.callsFake((_, ...args) => field._patch(...args))
      field.change('foo', { force: true })
      expect(field.getState()).to.include({ value: 'foo' })
    })

  })

  describe('visit', () => {

    it('patches the field\'s isVisited state through the form', () => {
      const field = Field.Model.create(form)
      form._patch.callsFake((_, ...args) => field._patch(...args))
      expect(field.getState()).to.include({ isVisited: false })
      field.visit()
      expect(field.getState()).to.include({ isVisited: true })
    })

  })

  describe('touch', () => {

    it('patches the field\'s isTouched state through the form', () => {
      const field = Field.Model.create(form)
      form._patch.callsFake((_, ...args) => field._patch(...args))
      expect(field.getState()).to.include({ isTouched: false })
      field.touch()
      expect(field.getState()).to.include({ isTouched: true })
    })

  })

  describe('untouch', () => {

    it('resets the field\'s isTouched state through the form', () => {
      const field = Field.Model.create(form)
      form._patch.callsFake((_, ...args) => field._patch(...args))
      field.touch()
      field.touch()
      field.touch()
      expect(field.getState()).to.include({ isTouched: true })
      field.untouch()
      expect(field.getState()).to.include({ isTouched: false })
    })

  })

  describe('reset', () => {

    it('resets the field\'s state', () => {
      const field = Field.Model.create(form)
      form._patch.callsFake((_, ...args) => field._patch(...args))
      field.change('test')
      field.visit()
      field.touch()
      expect(field.getState()).to.include({
        value: 'test',
        isVisited: true,
        isTouched: true
      })
      field.reset()
      expect(field.getState()).to.include({
        value: null,
        isVisited: false,
        isTouched: false
      })
    })

  })

})

describe('Field.View', () => {

  let form
  let mount

  beforeEach(() => {
    form = Form.Model.create()
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
      const target = wrapper.getDOMNode()
      const value = wrapper.instance().getValue({ target })
      expect(value).to.deep.equal(['foo', 'baz'])
    })

  })

  describe('control', () => {

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

    it('is checkable when it is a checkbox', done => {
      const test = ({ control }) => {
        expect(control).to.include({ checked: false })
        expect(control).not.to.have.property('value')
        done()
        return null
      }
      mount(<Field.View name='test' type='checkbox' render={test}/>)
    })

    it('is checkable when it is a radio button', done => {
      const test = ({ control }) => {
        expect(control).to.include({
          checked: true,
          value: 'foo'
        })
        done()
        return null
      }
      mount(
        <Field.View
          name='test'
          type='radio'
          init='foo'
          value='foo'
          render={test}/>
      )
    })

    describe('onBlur', () => {

      it('sets the field as touched', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        expect(wrapper.state()).to.include({ isTouched: false })
        wrapper.simulate('blur')
        expect(wrapper.state()).to.include({ isTouched: true })
      })

    })

    describe('onFocus', () => {

      it('sets the fields\'s isActive and isVisited state', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        expect(wrapper.state()).to.include({
          isVisited: false,
          isActive: false
        })
        wrapper.simulate('focus')
        expect(wrapper.state()).to.include({
          isVisited: true,
          isActive: true
        })
      })

    })

    describe('onChange', () => {

      it('sets the field\'s value state', () => {
        const wrapper = mount(<Field.View name='test' component='input'/>)
        expect(wrapper.state()).to.include({ value: '' })
        wrapper.simulate('change', { target: { value: 'test' } })
        expect(wrapper.state()).to.include({ value: 'test' })
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
        const { value } = wrapper.state()
        expect(value).to.be.a('date')
        expect(value.valueOf()).to.equal(0)
      })

    })

    describe('format', () => {

      it('formats the value from the field state', () => {
        const format = value => {
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
        const { value } = wrapper.state()
        expect(value).to.be.a('date')
        expect(wrapper).to.have.value('1970-01-01')
      })

    })

    describe('override', () => {

      it('sets the field model\'s override method', () => {
        const override = _ => _
        const wrapper = mount(<Field.View name='test' override={override}/>)
        const { model } = wrapper.instance()
        expect(model.config).to.include({ override })
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
          expect(field).to.be.an('object')
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
          expect(field).to.be.an('object')
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
          expect(field).to.be.an('object')
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
      class Test extends Component {
        render() {
          // eslint-disable-next-line react/prop-types
          expect(this.props.field).to.be.an('object')
          // eslint-disable-next-line react/prop-types
          expect(this.props.control).to.be.an('object')
          done()
          return null
        }
      }
      mount(<Field.View name='test' component={Test}/>)
    })

    it('spreads its control into the props of a tagName component', () => {
      const wrapper = mount(<Field.View name='test' component='input'/>)
      const input = wrapper.find('input')
      expect(input).to.have.props({ name: 'test', value: '' })
      expect(input).to.have.prop('onBlur').that.is.a('function')
      expect(input).to.have.prop('onFocus').that.is.a('function')
      expect(input).to.have.prop('onChange').that.is.a('function')
    })

  })

})
