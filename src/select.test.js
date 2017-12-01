import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField } from './__test__'
import Select from './select'

describe('Select', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders a select element', () => {
    const wrapper = mount(
      <Select name='test' value='baz'>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </Select>,
      { context }
    )
    expect(wrapper).to.have.tagName('select')
    expect(wrapper).to.have.value('baz')
  })

})
