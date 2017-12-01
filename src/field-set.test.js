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
        expect(this.model).to.deep.equal({
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
    const { fields: { foo: { bar } } } = wrapper.state()
    expect(bar).to.deep.equal({
      init: '',
      value: '',
      isTouched: false,
      isDirty: false,
      isPristine: true
    })
  })

  it('namespaces descendant field sets', () => {
    const wrapper = mount(
      <Form>
        <FieldSet name='foo'>
          <FieldSet name='bar'>
            <Input name='baz'/>
          </FieldSet>
        </FieldSet>
      </Form>
    )
    const { fields: { foo: { bar: { baz } } } } = wrapper.state()
    expect(baz).to.deep.equal({
      init: '',
      value: '',
      isTouched: false,
      isDirty: false,
      isPristine: true
    })
  })

  it('namespaces descendant field arrays', () => {
    const wrapper = mount(
      <Form values={{ foo: { bars: [''] } }}>
        <FieldSet name='foo'>
          <FieldArray name='bars'>
            { bars =>
              bars.map((_, i, key) =>
                <Input name={i} key={key}/>
              )
            }
          </FieldArray>
        </FieldSet>
      </Form>
    )
    const { fields: { foo: { bars: [ bar ] } } } = wrapper.state()
    expect(bar).to.deep.equal({
      init: '',
      value: '',
      isTouched: false,
      isDirty: false,
      isPristine: true
    })
  })

  it('tracks touches of its descendant fields', done => {
    class TestFieldSet extends FieldSet {
      componentDidUpdate() {
        super.componentDidUpdate()
        this.model.touches && done()
      }
    }
    const wrapper = mount(
      <Form>
        <TestFieldSet name='foo'>
          <Input name='bar'/>
        </TestFieldSet>
      </Form>
    )
    const { fields: { foo: { bar } } } = wrapper.state()
    bar.update({ isTouched: true })
  })

})
