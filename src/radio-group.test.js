import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import Radio from './radio'
import RadioGroup from './radio-group'

describe('RadioGroup', () => {

  let context

  beforeEach(() => {
    context = { setValue: spy(), getValue: stub() }
  })

  it('forwards its name to child radio inputs', () => {
    const group = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
      </RadioGroup>,
      { context }
    )
    expect(group.find(Radio)).to.have.attr('name', 'test')
  })

  it('reads its value from context', () => {
    context.getValue.returns('bar')
    const group = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
      </RadioGroup>,
      { context }
    )
    const bar = group.find('input[type="radio"][value="bar"]')
    expect(bar).to.be.checked()
  })

  it('registers a change handler', () => {
    const group = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
      </RadioGroup>,
      { context }
    )
    const { onChange } = group.find('input').props()
    expect(onChange).to.be.a('function')
  })

  it('updates its parent form on change', () => {
    const group = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
      </RadioGroup>,
      { context }
    )
    const radio = group.find('input[type="radio"]')
    const target = radio.getDOMNode()
    radio.simulate('change', { target })
    expect(context.setValue).to.have.been.calledWith({ test: 'foo' })
  })

})
