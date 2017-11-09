import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import TextArea from './text-area'

describe('TextArea', () => {

  let context

  beforeEach(() => {
    context = { setValue: spy(), getValue: stub() }
  })

  it('renders a textarea', () => {
    const area = mount(<TextArea name='test'/>, { context })
    expect(area).to.have.tagName('textarea')
  })

  it('is empty by default', () => {
    const area = mount(<TextArea name='test'/>, { context })
    expect(area).to.have.value('')
  })

  it('reads its value from context', () => {
    context.getValue.returns('foo')
    const area = mount(<TextArea name='test'/>, { context })
    expect(area).to.have.value('foo')
  })

  it('registers a change handler', () => {
    const area = mount(<TextArea name='test'/>, { context })
    const { onChange } = area.find('textarea').props()
    expect(onChange).to.be.a('function')
  })

  it('updates its parent form on change', () => {
    const area = mount(<TextArea name='test'/>, { context })
    const target = area.getDOMNode()
    target.value = 'foo'
    area.simulate('change', { target })
    expect(context.setValue).to.have.been.calledWith({ test: 'foo' })
  })

})
