import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField, spy } from './__test__'
import SelectMultiple from './select-multiple'

describe('SelectMultiple', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders a select multiple element', () => {
    const wrapper = mount(
      <SelectMultiple name='test' value={['foo', 'bar']}>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </SelectMultiple>
    )
    expect(wrapper).to.have.tagName('select')
    expect(wrapper).to.have.attr('multiple')
    expect(wrapper.find('option[value="foo"]')).to.be.selected()
    expect(wrapper.find('option[value="bar"]')).to.be.selected()
    expect(wrapper.find('option[value="baz"]')).not.to.be.selected()
  })

  it('updates its field with an array of selected options', () => {
    const wrapper = mount(
      <SelectMultiple name='test'>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </SelectMultiple>
    )
    const update = spy(wrapper.instance().field, 'update')
    wrapper.find('[value="baz"]').getDOMNode().checked = true
    wrapper.simulate('change')
    expect(update).to.have.been.calledWith({
      value: ['baz']
    })
  })

})
