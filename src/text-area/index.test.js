import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, mount, stub, mockField } from '../__test__'
import TextArea from '.'

describe('TextArea', () => {

  let context

  beforeEach(() => {
    context = {
      registerField: stub().returns(mockField('foo'))
    }
  })

  it('renders a textarea element', () => {
    const wrapper = mount(
      <TextArea name='test'/>,
      { context }
    )
    const textArea = wrapper.find('textarea')
    expect(textArea).to.have.value('foo')
  })

})
