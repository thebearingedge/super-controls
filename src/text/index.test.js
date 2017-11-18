import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import Text from '.'

describe('Text', () => {

  let context

  beforeEach(() => {
    context = {
      registerField: stub().returns(mockField('foo'))
    }
  })

  it('renders an input element of type text', () => {
    const wrapper = mount(
      <Text name='test'/>,
      { context }
    )
    const input = wrapper.find('input')
    expect(input).to.have.attr('type', 'text')
    expect(input).to.have.value('foo')
  })

})
