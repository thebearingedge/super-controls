import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import { Form } from './form'
import { Field } from './field'

describe('Field', () => {

  describe('modelField', () => {

    it('registers a field model on its parent form', () => {
      const form = mount(
        <Form init={{ foo: 'bar' }}>
          <Field name='foo'/>
        </Form>
      ).instance()
      expect(form.fields.foo).to.deep.include({
        form: form,
        init: 'bar',
        value: 'bar',
        path: ['foo'],
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false,
        isFocused: false
      })
    })

  })

  describe('render', () => {

    it('renders a component prop', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' init='bar' component={_ => <input/>}/>
        </Form>
      )
      expect(wrapper).to.contain(<input/>)
    })

    it('renders an element type', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' component='input' type='checkbox'/>
        </Form>
      )
      expect(wrapper.find('input')).to.have.attr('type', 'checkbox')
    })

    it('injects a control prop into its component', done => {
      const Test = ({ control }) => {
        expect(control).to.include({
          id: 'test',
          name: 'foo',
          value: 'bar',
          type: 'number'
        })
        expect(control.onBlur).to.be.a('function')
        expect(control.onFocus).to.be.a('function')
        expect(control.onChange).to.be.a('function')
        done()
        return null
      }
      mount(
        <Form>
          <Field
            id='test'
            name='foo'
            init='bar'
            type='number'
            component={Test}/>
        </Form>
      )
    })

    it('automatically set its control id to its name', done => {
      const Test = ({ control }) => {
        expect(control).to.include({
          id: 'foo'
        })
        done()
        return null
      }
      mount(
        <Form>
          <Field id name='foo' component={Test}/>
        </Form>
      )
    })

    it('injects a field prop into its component', done => {
      const Test = ({ field }) => {
        expect(field).to.deep.include({
          name: 'foo',
          init: 'bar',
          value: 'bar',
          error: null,
          notice: null,
          isDirty: false,
          isFocused: false,
          isVisited: false,
          isPristine: true,
          isTouched: false,
          isValid: true,
          isInvalid: false
        })
        expect(field.form).to.be.an('object')
        expect(field.update).to.be.a('function')
        done()
        return null
      }
      mount(
        <Form>
          <Field name='foo' init='bar' component={Test}/>
        </Form>
      )
    })

    it('forwards other props to its component', done => {
      const Test = ({ field, control, ...props }) => {
        expect(props).to.include({
          className: 'form-control'
        })
        done()
        return null
      }
      mount(
        <Form>
          <Field name='foo' className='form-control' component={Test}/>
        </Form>
      )
    })

    it('decides whether a control is checkable', done => {
      const Test = ({ control }) => {
        expect(control).not.to.have.property('value')
        expect(control).to.include({
          checked: true
        })
        done()
        return null
      }
      mount(
        <Form>
          <Field name='foo' type='checkbox' init={true} component={Test}/>
        </Form>
      )
    })

    it('decides whether a radio button is checked', done => {
      const Test = ({ control }) => {
        expect(control).to.include({
          value: 'bar',
          checked: false
        })
        done()
        return null
      }
      mount(
        <Form>
          <Field
            name='foo'
            type='radio'
            value='bar'
            init='baz'
            component={Test}/>
        </Form>
      )
    })

  })

  describe('onChange', () => {

    it('receives value change updates from its component', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' init='bar' component='input'/>
        </Form>
      )
      const { fields: { foo } } = wrapper.instance()
      const update = spy(foo, 'update')
      wrapper.find('input').simulate('change', { target: { value: 'baz' } })
      expect(update).to.have.been.calledWith({ value: 'baz' })
    })

    it('receives checked change updates from its component', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' type='checkbox' init={false} component='input'/>
        </Form>
      )
      const { fields: { foo } } = wrapper.instance()
      const update = spy(foo, 'update')
      wrapper.find('input').getDOMNode().checked = true
      wrapper.find('input').simulate('change')
      expect(update).to.have.been.calledWith({ value: true })
    })

  })

  describe('onBlur', () => {

    it('receives blur updates from its component', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' init='bar' component='input'/>
        </Form>
      )
      wrapper.find('input').simulate('blur')
      expect(wrapper.state()).to.deep.include({
        values: { foo: 'bar' },
        touched: { foo: true },
        focused: null
      })
    })

  })

  describe('onFocus', () => {

    it('receives focus updates from its component', () => {
      const wrapper = mount(
        <Form init={{ foo: 'bar' }}>
          <Field name='foo' init='bar' component='input'/>
        </Form>
      )
      const { fields: { foo } } = wrapper.instance()
      const update = spy(foo, 'update')
      wrapper.find('input').simulate('focus')
      expect(update).to.have.been.calledWith({ isFocused: foo })
    })

  })

  describe('componentWillUnmount', () => {

    it('unregisters its model when it unmounts', () => {
      const wrapper = mount(
        <Form>
          <Field name='foo' init='bar'/>
        </Form>
      )
      const { fields: { foo } } = wrapper.instance()
      const unregister = spy(foo, 'unregister')
      wrapper.unmount()
      expect(unregister).to.have.callCount(1)
    })

  })

  describe('shouldComponentUpdate', () => {

    it('re-renders if it receives new props', done => {
      class TestField extends Field {
        componentWillUpdate() {}
      }
      stub(TestField.prototype, 'componentWillUpdate')
        .callsFake(() => done())
      const Test = props =>
        <Form>
          <TestField name='foo' {...props}/>
        </Form>
      const wrapper = mount(<Test/>)
      wrapper.setProps({ className: 'form-control' })
    })

    it('re-renders if its value state is out of sync with its model', done => {
      class TestField extends Field {
        componentWillUpdate() {}
      }
      stub(TestField.prototype, 'componentWillUpdate')
        .callsFake(() => done())
      const wrapper = mount(
        <Form>
          <TestField name='foo'/>
        </Form>
      )
      wrapper.setState({ values: { foo: 'bar' } })
    })

    it('re-renders if its touched state is out of sync with its model', done => {
      class TestField extends Field {
        componentWillUpdate() {}
      }
      stub(TestField.prototype, 'componentWillUpdate')
        .callsFake(() => done())
      const wrapper = mount(
        <Form>
          <TestField name='foo'/>
        </Form>
      )
      wrapper.setState({ touched: { foo: true } })
    })

  })

  describe('format', () => {

    it('formats the form value for rendering', () => {
      const format = value => {
        if (!value) return value
        const year = value.getFullYear()
        const month = `${value.getMonth() + 1}`.padStart(2, 0)
        const day = `${value.getDate()}`.padStart(2, 0)
        return `${year}-${month}-${day}`
      }
      const init = new Date('1/1/1970')
      const wrapper = mount(
        <Form>
          <Field
            name='date'
            type='date'
            init={init}
            format={format}
            component='input'/>
        </Form>
      )
      expect(wrapper.find('input')).to.have.value('1970-01-01')
      expect(wrapper.state()).to.deep.include({ values: { date: init } })
    })

  })

  describe('parse', () => {

    it('parses the input value to be stored in the form', () => {
      const parse = value => new Date(value || '1970-01-01')
      const wrapper = mount(
        <Form>
          <Field
            name='date'
            type='date'
            parse={parse}
            component='input'/>
        </Form>
      )
      const { values: { date: init } } = wrapper.state()
      expect(init).to.be.a('date')
      expect(init.getUTCFullYear()).to.equal(1970)
      wrapper
        .find('input')
        .simulate('change', { target: { value: '2017-01-01' } })
      const { values: { date: parsed } } = wrapper.state()
      expect(parsed).to.be.a('date')
      expect(parsed.getUTCFullYear()).to.equal(2017)
    })

  })

  describe('override', () => {

    it('overrides the input value to be stored in the form', () => {
      const override = (end, { start }) => end < start ? start : end
      const wrapper = mount(
        <Form init={{ start: 2017, end: 2018 }}>
          <Field name='start' component='input' type='number'/>
          <Field
            name='end'
            type='number'
            parse={Number}
            component='input'
            override={override}/>
        </Form>
      )
      wrapper
        .find('[name="end"]')
        .hostNodes()
        .simulate('change', { target: { value: '1970' } })
      const { values: { end: overridden } } = wrapper.state()
      expect(overridden).to.equal(2017)
    })

  })

})
