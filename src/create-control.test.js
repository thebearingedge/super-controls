import React from 'react'
import { describe, it } from 'mocha'
import { mountWith, expect, stub, spy, mockField } from './__test__'
import createControl from './create-control'

describe('createControl', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('accepts a configuration object', () => {
    const propTypes = { foo() {} }
    const defaultProps = { foo: 'foo' }
    const Control = createControl(() => null)({
      propTypes,
      defaultProps
    })
    expect(Control)
      .to.have.property('propTypes')
      .that.includes(propTypes)
    expect(Control)
      .to.have.property('defaultProps')
      .that.includes(defaultProps)
  })

  it('registers a field via context', () => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(<Input name='test'/>)
    const { model } = wrapper.instance()
    expect(model.path).to.deep.equal(['test'])
  })

  it('renders a component', () => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )({
      defaultProps: {
        value: ''
      }
    })
    const wrapper = mount(<Input name='test'/>)
    expect(wrapper).to.have.tagName('input')
    expect(wrapper).to.have.attr('name', 'test')
    expect(wrapper).to.have.value('')
  })

  it('forwards props to its component', () => {
    const Input = createControl(({ control, ...props }) =>
      <input {...control} {...props}/>
    )()
    const wrapper = mount(
      <Input id='foo' name='test' className='form-control'/>
    )
    expect(wrapper).to.have.attr('id', 'foo')
    expect(wrapper).to.have.attr('class', 'form-control')
  })

  it('passes an id prop that matches the name prop', () => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(<Input id name='test'/>)
    expect(wrapper).to.have.attr('id', 'test')
  })

  it('accepts a custom valueKey', () => {
    const Input = createControl(({ control, ...props }) =>
      <input {...control} {...props}/>
    )({
      valueKey: 'checked',
      defaultProps: {
        checked: true
      }
    })
    const wrapper = mount(<Input name='test' type='checkbox'/>)
    expect(wrapper.find('input[type="checkbox"]')).to.be.checked()
  })

  it('optionally injects a field model into its component', () => {
    const Simple = createControl(({ field, control }) => {
      expect(field).to.equal(void 0)
      return null
    })()
    const Advanced = createControl(({ field, control }) => {
      expect(field).to.be.an('object')
      return null
    })({
      injectField: true
    })
    mount(<Simple name='test'/>)
    mount(<Advanced name='test'/>)
  })

  it('receives value updates from its component', () => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(<Input name='test'/>)
    const update = spy(wrapper.instance().model, 'update')
    const input = wrapper.find('input')
    const target = Object.assign(input.getDOMNode(), { value: 'foo' })
    input.simulate('change', { target })
    expect(update).to.have.been.calledWith({ value: 'foo' })
  })

  it('receives touch updates from its component', () => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(<Input name='test'/>)
    const update = spy(wrapper.instance().model, 'update')
    const input = wrapper.find('input')
    input.simulate('blur')
    expect(update).to.have.been.calledWith({ isTouched: true })
  })

  it('re-renders when its field is touched', done => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    const wrapper = mount(<Input name='test'/>)
    stub(Input.prototype, 'componentDidUpdate')
      .callThrough()
      .onCall(1)
      .callsFake(() => done())
      .onCall(2)
      .callsFake(() => done())
    const { model } = wrapper.instance()
    model.isTouched = true
    wrapper.setState({ isTouched: false })
    wrapper.setState({ isTouched: false })
    wrapper.setState({ isTouched: true })
  })

  it('re-renders when its field has a new value', done => {
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )({
      defaultProps: {
        value: ''
      }
    })
    const wrapper = mount(<Input name='test'/>)
    stub(Input.prototype, 'componentDidUpdate')
      .callThrough()
      .onCall(1)
      .callsFake(() => done())
      .onCall(2)
      .callsFake(() => done())
    const { model } = wrapper.instance()
    model.value = ''
    wrapper.setState({ value: 'foo' })
    wrapper.setState({ value: 'foo' })
    wrapper.setState({ value: '' })
  })

  it('it re-renders when it receives new non-children props', done => {
    const Input = createControl(({ control, ...props }) =>
      <input {...control} {...props}/>
    )({
      defaultProps: {
        value: ''
      }
    })
    stub(Input.prototype, 'componentDidUpdate')
      .callThrough()
      .onCall(0)
      .callsFake(() => done())
      .onCall(1)
      .callsFake(() => done())
    const wrapper = mount(<Input name='test'/>)
    wrapper.setProps({ id: true, className: 'form-control' })
    wrapper.setProps({ id: true, className: 'form-control' })
    wrapper.setProps({ id: true, className: 'form-control' })
  })

})
