import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, spy, mockField } from '../__test__'
import createControl from '.'

describe('createControl', () => {

  it('accepts a configuration object', () => {
    const propTypes = { foo() {} }
    const defaultProps = { foo: 'foo' }
    const Input = createControl(({ field, control, ...props }) =>
      <input {...props}/>
    )({
      propTypes,
      defaultProps
    })
    expect(Input).to.have.property('defaultProps', defaultProps)
    expect(Input)
      .to.have.property('propTypes')
      .that.includes(propTypes)
  })

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  it('renders a component', () => {
    registerField.returns(mockField(''))
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(
      <Input id name='test'/>,
      { context }
    )
    expect(wrapper.state()).to.deep.equal({
      value: '',
      isTouched: false
    })
    const input = wrapper.find('input')
    expect(input).to.have.attr('name', 'test')
    expect(input).to.have.attr('id', 'test')
    expect(input).to.have.value('')
    expect(input)
      .to.have.prop('onChange')
      .that.is.a('function')
    expect(input)
      .to.have.prop('onBlur')
      .that.is.a('function')
  })

  it('forwards props to its component', () => {
    registerField.returns(mockField(''))
    const Input = createControl(({ control, ...props }) =>
      <input {...props} {...control}/>
    )()
    const wrapper = mount(
      <Input name='test' className='form-control'/>,
      { context }
    )
    expect(wrapper.find('input')).to.have.attr('class', 'form-control')
  })

  it('accepts a custom valueKey', () => {
    registerField.returns(mockField(true))
    const Input = createControl(({ control, ...props }) =>
      <input {...props} {...control}/>
    )({
      valueKey: 'checked'
    })
    const wrapper = mount(
      <Input name='test' type='checkbox'/>,
      { context }
    )
    expect(wrapper.find('input[type="checkbox"]')).to.be.checked()
  })

  it('receives change events from its component', () => {
    const field = mockField('')
    spy(field, 'update')
    registerField.returns(field)
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(
      <Input name='test'/>,
      { context }
    )
    const input = wrapper.find('input')
    const target = Object.assign(input.getDOMNode(), { value: 'foo' })
    input.simulate('change', { target })
    expect(field.update).to.have.been.calledWith({ value: 'foo' })
  })

  it('receives blur events from its component', () => {
    const field = mockField('')
    spy(field, 'update')
    registerField.returns(field)
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(
      <Input name='test'/>,
      { context }
    )
    wrapper.find('input').simulate('blur')
    expect(field.update).to.have.been.calledWith({ isTouched: true })
  })

  it('syncs its local state with its field state', done => {
    registerField.returns(mockField('foo'))
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    stub(Input.prototype, 'componentDidUpdate')
      .callThrough()
      .onCall(1)
      .callsFake(() => done())
      .onCall(2)
      .callsFake(() => done())
    const wrapper = mount(
      <Input name='test'/>,
      { context }
    )
    wrapper.setState({ value: 'bar' })
    wrapper.setProps({ className: 'form-control' })
  })

})
