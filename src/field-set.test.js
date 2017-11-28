import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect } from './__test__'
import Form from './form'
import FieldSet from './field-set'
import FieldArray from './field-array'
import createControl from './create-control'

const Input = createControl(({ control, ...props }) =>
  <input {...control} {...props}/>
)({
  displayName: 'Input',
  defaultProps: {
    value: ''
  }
})

describe('FieldSet', () => {

  it('registers a field set model', done => {
    class TestFieldSet extends FieldSet {
      componentDidMount() {
        expect(this.fieldSet).to.deep.equal({
          fields: {},
          init: {},
          value: {},
          isTouched: false,
          isDirty: false,
          isPristine: true
        })
        done()
      }
    }
    mount(
      <Form>
        <TestFieldSet name='foo'/>
      </Form>
    )
  })

  it('namespaces descendant fields', () => {
    const wrapper = mount(
      <Form>
        <FieldSet name='foo'>
          <Input name='bar'/>
        </FieldSet>
      </Form>
    )
    const { init: { foo: { bar } } } = wrapper.instance()
    expect(bar).to.equal('')
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

  it('namespaces descendant field arrays', () => {
    const wrapper = mount(
      <Form>
        <FieldSet name='foo'>
          <FieldArray name='bar'>
          </FieldArray>
        </FieldSet>
      </Form>
    )
    const { init: { foo: { bar } } } = wrapper.instance()
    expect(bar).to.deep.equal([])
  })

  it('tracks mutations of its descendant fields', done => {
    class TestFieldSet extends FieldSet {
      componentDidUpdate() {
        super.componentDidUpdate()
        expect(this.fieldSet.mutations).to.equal(1)
        done()
      }
    }
    const wrapper = mount(
      <Form>
        <TestFieldSet name='foo'>
          <Input name='bar'/>
        </TestFieldSet>
      </Form>
    )
    const { fields: { foo: { bar } } } = wrapper.instance()
    bar.update({ isTouched: true })
  })

})
