import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import RadioGroup from '.'
import Radio from '../radio'

describe('RadioGroup', () => {

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  it('checks its matching radio input', () => {
    registerField.returns(mockField('bar'))
    const radioGroup = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>,
      { context }
    )
    expect(radioGroup.find('input[value="foo"]')).not.to.be.checked()
    expect(radioGroup.find('input[value="bar"]')).to.be.checked()
    expect(radioGroup.find('input[value="baz"]')).not.to.be.checked()
  })

  it('updates its field when its radio inputs change', () => {
    const field = mockField('foo')
    registerField.returns(field)
    stub(field, 'update')
    const radioGroup = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>,
      { context }
    )
    radioGroup.find('input[value="baz"]').simulate('change')
    expect(field.update).to.have.been.calledWith({
      value: 'baz',
      isTouched: true
    })
  })

  it('updates its field when its radio inputs blur', done => {
    const field = mockField('')
    registerField.returns(field)
    const radioGroup = mount(
      <RadioGroup name='test'>
        <Radio value='foo'/>
        <Radio value='bar'/>
        <Radio value='baz'/>
      </RadioGroup>,
      { context }
    )
    stub(field, 'update')
      .callsFake(() => {
        expect(field.update).to.have.been.calledWith({
          isTouched: true
        })
        done()
      })
    radioGroup.find('input[value="foo"]').simulate('blur')
  })

})
