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
        expect(this.model).to.deep.equal({
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
        <TestFieldArray name='foos'/>
      </Form>
    )
  })

  it('namespaces descendant fields', done => {
    class TestInput extends Input {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0])
        done()
      }
    }
    mount(
      <Form values={{ foos: [''] }}>
        <FieldArray name='foos'>
          { foos =>
            foos.map((foo, index) => <TestInput name={index} key={index}/>)
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant field sets', done => {
    class TestInput extends Input {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0, 'bar'])
        done()
      }
    }
    mount(
      <Form values={{ foos: [''] }}>
        <FieldArray name='foos'>
          { foos =>
            foos.map((foo, index) =>
              <FieldSet name={index} key={index}>
                <TestInput name='bar'/>
              </FieldSet>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant field arrays', done => {
    class TestInput extends Input {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0, 0])
        done()
      }
    }
    mount(
      <Form values={{ foos: [['']] }}>
        <FieldArray name='foos'>
          { foos =>
            foos.map((foo, index) =>
              <FieldArray name={index} key={index}>
                { zeroes =>
                  zeroes.map((zero, index) =>
                    <TestInput name={index} key={index}/>
                  )
                }
              </FieldArray>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('tracks touches of its descendant fields', done => {
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {
        super.componentDidUpdate()
        this.model.touches && done()
      }
    }
    const wrapper = mount(
      <Form values={{ foos: [''] }}>
        <TestFieldArray name='foos'>
          { foos =>
            foos.map((foo, index) => <Input name={index} key={index}/>)
          }
        </TestFieldArray>
      </Form>
    )
    const { fields: { foos: [ foo ] } } = wrapper.state()
    foo.update({ isTouched: true })
  })

})
