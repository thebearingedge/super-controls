import React from 'react'
import { describe, it } from 'mocha'
import { expect, mountWith, mockField } from './__test__'
import TextArea from './text-area'

describe('TextArea', () => {

  const context = { registerField: mockField }
  const mount = mountWith({ context })

  it('renders a textarea element', () => {
    const wrapper = mount(<TextArea name='test' value='foo'/>)
    expect(wrapper).to.have.tagName('textarea')
    expect(wrapper).to.have.value('foo')
  })

})
