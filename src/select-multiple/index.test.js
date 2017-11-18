import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, spy, mockField } from '../__test__'
import SelectMultiple from '.'

describe('SelectMultiple', () => {

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  it('renders a select multiple element', () => {
    registerField.returns(mockField(['foo', 'bar']))
    const wrapper = mount(
      <SelectMultiple name='test'>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </SelectMultiple>,
      { context }
    )
    expect(wrapper.find('option[value="foo"]')).to.be.selected()
    expect(wrapper.find('option[value="bar"]')).to.be.selected()
    expect(wrapper.find('option[value="baz"]')).not.to.be.selected()
  })

  it('updates its field with an array of selected options', () => {
    const field = mockField(['foo', 'bar', 'baz'])
    spy(field, 'update')
    registerField.returns(field)
    const wrapper = mount(
      <SelectMultiple name='test'>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </SelectMultiple>,
      { context }
    )
    wrapper.simulate('change')
    expect(field.update).to.have.been.calledWith({
      value: [
        'foo',
        'bar',
        'baz'
      ]
    })
  })

})
