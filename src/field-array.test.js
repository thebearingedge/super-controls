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
  injectField: true,
  displayName: 'Input',
  defaultProps: {
    value: ''
  }
})

describe('FieldArray', () => {

  it('registers a field array model', done => {
    class TestFieldArray extends FieldArray {
      componentDidMount() {
        expect(this.fieldArray).to.deep.equal({
          fields: [],
          init: [],
          value: [],
          length: 0,
          isTouched: false,
          isDirty: false,
          isPristine: true
        })
        done()
      }
    }
    mount(
      <Form>
        <TestFieldArray name='foo'/>
      </Form>
    )
  })

  it('namespaces descendant field sets', done => {
    class TestFieldSet extends FieldSet {
      componentDidMount() {
        expect(this.fieldSet.path).to.deep.equal(['foo', 0])
        done()
      }
    }
    mount(
      <Form>
        <FieldArray name='foo' value={[{}]}>
          { foo =>
            foo.map((foo, i, key) => <TestFieldSet name={i} key={key}/>)
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant fields', done => {
    class TestInput extends Input {
      componentDidMount() {
        expect(this.field.path).to.deep.equal(['foo', 0])
        done()
      }
    }
    mount(
      <Form>
        <FieldArray name='foo' value={['']}>
          { foo =>
            foo.map((foo, i, key) => <TestInput name={i} key={key}/>)
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant field arrays', done => {
    class TestInput extends Input {
      componentDidMount() {
        expect(this.field.path).to.deep.equal(['foo', 0, 0])
        done()
      }
    }
    mount(
      <Form>
        <FieldArray name='foo' value={[['']]}>
          { foo =>
            foo.map((_, i, key) =>
              <FieldArray name={i} key={key} value={['']}>
                { zero =>
                  zero.map((_, i, key) =>
                    <TestInput name={i} key={key}/>
                  )
                }
              </FieldArray>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('tracks mutations of its descendant fields', done => {
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {
        super.componentDidUpdate()
        expect(this.fieldArray.mutations).to.equal(1)
        done()
      }
    }
    const wrapper = mount(
      <Form>
        <TestFieldArray name='foo' value={['']}>
          { foo =>
            foo.map((_, i, key) => <Input name={i} key={key}/>)
          }
        </TestFieldArray>
      </Form>
    )
    const { fields: { foo: [ bar ] } } = wrapper.instance()
    bar.update({ isTouched: true })
  })

})
