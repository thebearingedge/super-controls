import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField, spy, stub } from './__test__'
import RadioGroup from './radio-group'
import Radio from './radio'

describe('RadioGroup', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('checks its matching radio input', () => {
    const wrapper = mount(
      <RadioGroup name='test' value='bar'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>
    )
    expect(wrapper.find('input[value="foo"]')).not.to.be.checked()
    expect(wrapper.find('input[value="bar"]')).to.be.checked()
    expect(wrapper.find('input[value="baz"]')).not.to.be.checked()
  })

  it('updates its field when its radio inputs change', () => {
    const wrapper = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>
    )
    const update = spy(wrapper.instance().model, 'update')
    wrapper.find('input[value="baz"]').simulate('change')
    expect(update).to.have.been.calledWith({
      value: 'baz',
      isTouched: true
    })
  })

  it('updates its field after its radio inputs blur', done => {
    const wrapper = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>
    )
    stub(wrapper.instance().model, 'update')
      .callsFake(state => {
        expect(state).to.deep.equal({ isTouched: true })
        done()
      })
    wrapper.find('input[value="foo"]').simulate('blur')
  })

})
