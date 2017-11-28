import React from 'react'
import { describe, it } from 'mocha'
import { mountWith, expect, mockField } from './__test__'
import Input from './input'

describe('Input', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders a generic input', () => {
    const wrapper = mount(<Input name='test' value='foo'/>)
    const input = wrapper.find('input')
    expect(input).not.to.have.attr('type')
    expect(input).to.have.value('foo')
  })

})
