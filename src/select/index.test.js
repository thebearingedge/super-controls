import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import Select from '.'

describe('Select', () => {

  let context

  beforeEach(() => {
    context = {
      registerField: stub().returns(mockField('baz'))
    }
  })

  it('renders a select element', () => {
    const wrapper = mount(
      <Select name='test'>
        <option value='foo'/>
        <option value='bar'/>
        <option value='baz'/>
      </Select>,
      { context }
    )
    const select = wrapper.find('select')
    expect(select).to.have.value('baz')
  })

})
