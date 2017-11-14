import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect } from './__test__'
import Form from './form'
import Text from './text'

describe('Form', () => {

  describe('registers descendant fields', () => {

    it('Text', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: 'foo' })
          done()
        }
      }
      mount(
        <TestForm>
          <Text name='test' value='foo'/>
        </TestForm>
      )
    })

    it('TextArea')

    it('Text')

    it('Checkbox')

    it('Select')

  })

  describe('overrides its descendant field values', () => {

    it('Text', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values)
            .to.deep.equal({
              foo: 'bar',
              baz: 'qux'
            })
          done()
        }
      }
      mount(
        <TestForm values={{ baz: 'qux' }}>
          <Text name='foo' value='bar'/>
          <Text name='baz' value=''/>
        </TestForm>
      )
    })

  })

})
