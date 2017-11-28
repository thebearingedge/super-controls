import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField } from './__test__'
import Text from './text'

describe('Text', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders an input element of type text', () => {
    const wrapper = mount(<Text name='test' value='foo'/>)
    expect(wrapper).to.have.tagName('input')
    expect(wrapper).to.have.attr('type', 'text')
    expect(wrapper).to.have.value('foo')
  })

})
