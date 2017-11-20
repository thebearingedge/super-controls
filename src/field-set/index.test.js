import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, mockField } from '../__test__'
import createControl from '../create-control'
import FieldSet from '.'

describe('FieldSet', () => {

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  it('registers namespaced controlled components', () => {
    registerField.returns(mockField('foo'))
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )()
    mount(
      <FieldSet name='test'>
        <Input name='test' value='foo'/>
      </FieldSet>,
      { context }
    )
    expect(registerField).to.have.been.calledWith({
      name: 'test.test',
      value: 'foo'
    })
  })

})
