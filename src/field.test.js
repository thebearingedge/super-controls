import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import { Form } from './form'
import { Field } from './field'

describe('Field', () => {

  it('registers its path and value via context', () => {
    class TestField extends Field {
      componentDidMount() {
        expect(this.model).to.deep.include({
          value: 'bar',
          path: ['foo']
        })
      }
    }
    mount(
      <Form init={{ foo: 'bar' }}>
        <TestField name='foo'/>
      </Form>
    )
  })

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

  it('injects a control model into its component', done => {
    const Test = ({ control }) => {
      expect(control).to.include({
        name: 'foo',
        value: 'bar'
      })
      expect(control.onBlur).to.be.a('function')
      expect(control.onFocus).to.be.a('function')
      expect(control.onChange).to.be.a('function')
      done()
      return null
    }
    mount(
      <Form>
        <Field name='foo' init='bar' component={Test}/>
      </Form>
    )
  })

  it('passes its id prop to its control', done => {
    const Test = ({ control }) => {
      expect(control).to.include({
        id: 'test'
      })
      done()
      return null
    }
    mount(
      <Form>
        <Field id='test' name='foo' component={Test}/>
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

  it('injects a field model into its component', done => {
    const Test = ({ field }) => {
      expect(field).to.deep.include({
        init: 'bar',
        value: 'bar',
        isDirty: false,
        isPristine: true,
        isTouched: false
      })
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

  it('receives blur updates from its component', () => {
    const wrapper = mount(
      <Form>
        <Field name='foo' init='bar' component='input'/>
      </Form>
    )
    const { fields: { foo } } = wrapper.instance()
    const update = spy(foo, 'update')
    wrapper.find('input').simulate('blur')
    expect(update).to.have.been.calledWith({
      isFocused: null,
      isTouched: true
    })
  })

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
