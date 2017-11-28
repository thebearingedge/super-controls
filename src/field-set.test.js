import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect } from './__test__'
import createControl from './create-control'
import Form from './form'
import FieldSet from './field-set'

const Input = createControl(({ control, ...props }) =>
  <input {...control} {...props}/>
)({
  displayName: 'Input',
  defaultProps: {
    value: ''
  }
})

describe('FieldSet', () => {

  it('namespaces descendant fields', () => {
    const wrapper = mount(
      <Form>
        <FieldSet name='foo'>
          <Input name='bar'/>
        </FieldSet>
      </Form>
    )
    const { fields: { foo: { bar } } } = wrapper.instance()
    expect(bar.path).to.deep.equal(['foo', 'bar'])
  })

  it('namespaces descendant field sets', () => {
    const wrapper = mount(
      <Form>
        <FieldSet name='foo'>
          <FieldSet name='bar'>
          </FieldSet>
        </FieldSet>
      </Form>
    )
    const { init: { foo: { bar } } } = wrapper.instance()
    expect(bar).to.deep.equal({})
  })

  it('namespaces descendant field arrays')

  it('tracks descendant field mutations')

  it('tracks descendant field set mutations')

  it('tracks descendant field array mutations')

})
