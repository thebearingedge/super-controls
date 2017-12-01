import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField } from './__test__'
import Checkbox from './checkbox'

describe('Checkbox', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders an input of type checkbox', () => {
    const wrapper = mount(<Checkbox name='test' checked/>)
    expect(wrapper).to.have.tagName('input')
    expect(wrapper).to.have.attr('type', 'checkbox')
    expect(wrapper).to.be.checked()
  })

})
