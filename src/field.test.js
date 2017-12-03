import React from 'react'
import { describe, it } from 'mocha'
import { KEY } from './util'
import { mockField, mountWith, expect, spy, stub } from './__test__'
import { Field } from './field'

describe('Field', () => {

  const context = { [KEY]: { register: mockField } }
  const mount = mountWith({ context })

  it('registers its path and value via context', () => {
    const wrapper = mount(<Field name='foo' init='bar'/>)
    const { model } = wrapper.instance()
    expect(model.path).to.deep.equal(['foo'])
    expect(model.value).to.equal('bar')
  })

  it('renders a component prop', () => {
    const wrapper = mount(
      <Field name='foo' init='bar' component={_ => <input/>}/>
    )
    expect(wrapper).to.have.tagName('input')
  })

  it('renders a child function', () => {
    const wrapper = mount(
      <Field name='foo' init='bar'>
        { _ => <input/> }
      </Field>
    )
    expect(wrapper).to.have.tagName('input')
  })

  it('renders an element type', () => {
    const wrapper = mount(
      <Field name='foo' component='input' type='checkbox'/>
    )
    expect(wrapper).to.have.tagName('input')
    expect(wrapper).to.have.attr('type', 'checkbox')
  })

  it('injects a control model into its component', done => {
    const Test = ({ control }) => {
      expect(control).to.include({
        name: 'foo',
        value: 'bar'
      })
      expect(control.onBlur).to.be.a('function')
      expect(control.onChange).to.be.a('function')
      done()
      return null
    }
    mount(
      <Field name='foo' init='bar' component={Test}/>
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
      <Field id name='foo' component={Test}/>
    )
  })

  it('injects a field model into its component', done => {
    const Test = ({ field }) => {
      expect(field).to.deep.include({
        path: ['foo'],
        init: 'bar',
        value: 'bar',
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
      done()
      return null
    }
    mount(
      <Field name='foo' init='bar' component={Test}/>
    )
  })

  it('forwards other props to its component', done => {
    const Test = ({ field, control, ...props }) => {
      expect(props).to.include({
        id: 'test',
        className: 'form-control'
      })
      done()
      return null
    }
    mount(
      <Field
        id='test'
        name='foo'
        component={Test}
        className='form-control'/>
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
      <Field name='foo' init={true} component={Test}/>
    )
  })

  it('receives value updates from its component', () => {
    const wrapper = mount(
      <Field name='foo' init='bar'>
        { ({ control }) => <input {...control}/> }
      </Field>
    )
    const { model } = wrapper.instance()
    const update = spy(model, 'update')
    wrapper.find('input').simulate('change', { target: { value: 'baz' } })
    expect(update).to.have.been.calledWith({ value: 'baz' })
  })

  it('receives checked updates from its component', () => {
    const wrapper = mount(
      <Field name='foo' init={false}>
        { ({ control }) => <input type='checkbox' {...control}/> }
      </Field>
    )
    const { model } = wrapper.instance()
    const update = spy(model, 'update')
    wrapper.find('input').getDOMNode().checked = true
    wrapper.find('input').simulate('change')
    expect(update).to.have.been.calledWith({ value: true })
  })

  it('receives touch updates from its component', () => {
    const wrapper = mount(
      <Field name='foo' init='bar'>
        { ({ control }) => <input {...control}/> }
      </Field>
    )
    const { model } = wrapper.instance()
    const update = spy(model, 'update')
    wrapper.find('input').simulate('blur')
    expect(update).to.have.been.calledWith({ isTouched: true })
  })

  it('unregisters its model when it unmounts', () => {
    const wrapper = mount(
      <Field name='foo' init='bar'>
        { ({ control }) => <input {...control}/> }
      </Field>
    )
    const { model } = wrapper.instance()
    const unregister = spy(model, 'unregister')
    wrapper.unmount()
    expect(unregister).to.have.callCount(1)
  })

  it('re-renders if it receives new props', done => {
    class TestField extends Field {
      componentWillUpdate() {}
    }
    stub(TestField.prototype, 'componentWillUpdate')
      .callsFake(() => done())
    const wrapper = mount(<TestField name='foo'/>)
    wrapper.setProps({ className: 'form-control' })
  })

  it('re-renders if its value state is out of sync with its model', done => {
    class TestField extends Field {
      componentWillUpdate() {}
    }
    stub(TestField.prototype, 'componentWillUpdate')
      .callsFake(() => done())
    const wrapper = mount(<TestField name='foo'/>)
    wrapper.setState({ value: 'bar' })
  })

  it('re-renders if its touched state is out of sync with its model', done => {
    class TestField extends Field {
      componentWillUpdate() {}
    }
    stub(TestField.prototype, 'componentWillUpdate')
      .callsFake(() => done())
    const wrapper = mount(<TestField name='foo'/>)
    wrapper.setState({ isTouched: true })
  })

})
