import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import Input from '.'

describe('Input', () => {

  let context

  beforeEach(() => {
    context = {
      registerField: stub().returns(mockField('foo'))
    }
  })

  it('renders a generic input', () => {
    const wrapper = mount(
      <Input name='test'/>,
      { context }
    )
    const input = wrapper.find('input')
    expect(input).not.to.have.attr('type')
    expect(input).to.have.value('foo')
  })

})
