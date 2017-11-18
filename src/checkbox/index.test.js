import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import Checkbox from '.'

describe('Checkbox', () => {

  let context

  beforeEach(() => {
    context = {
      registerField: stub().returns(mockField(true))
    }
  })

  it('renders an input of type checkbox', () => {
    const wrapper = mount(
      <Checkbox name='test'/>,
      { context }
    )
    const checkbox = wrapper.find('input')
    expect(checkbox).to.have.attr('type', 'checkbox')
    expect(checkbox).to.be.checked()
  })

})
