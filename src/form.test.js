import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect } from './__test__'
import Form from './form'
import Input from './input'
import TextArea from './text-area'
import Select from './select'
import Text from './text'
import Checkbox from './checkbox'

describe('Form', () => {

  describe('registers descendant fields', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: 'foo' })
          done()
        }
      }
      mount(
        <TestForm>
          <Input name='test' value='foo'/>
        </TestForm>
      )
    })

    it('TextArea', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: 'foo' })
          done()
        }
      }
      mount(
        <TestForm>
          <TextArea name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Select', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: '' })
          done()
        }
      }
      mount(
        <TestForm>
          <Select name='test'/>
        </TestForm>
      )
    })

    it('Text', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: 'foo' })
          done()
        }
      }
      mount(
        <TestForm>
          <TextArea name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Checkbox', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: false })
          done()
        }
      }
      mount(
        <TestForm>
          <Checkbox name='test'/>
        </TestForm>
      )
    })

  })

  describe('adds its descendant values to state', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'foo'
          })
          done()
        }
      }
      mount(
        <TestForm>
          <Input name='test' value='foo'/>
        </TestForm>
      )
    })

    it('TextArea', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'foo'
          })
          done()
        }
      }
      mount(
        <TestForm>
          <TextArea name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Select', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'foo'
          })
          done()
        }
      }
      mount(
        <TestForm>
          <Select name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Text', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'foo'
          })
          done()
        }
      }
      mount(
        <TestForm>
          <Text name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Checkbox', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: true
          })
          done()
        }
      }
      mount(
        <TestForm>
          <Checkbox name='test' checked/>
        </TestForm>
      )
    })

  })

  describe('overrides its descendant values', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
      }
      mount(
        <TestForm values={{ test: 'bar' }}>
          <Input name='test' value='foo'/>
        </TestForm>
      )
    })

    it('TextArea', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
      }
      mount(
        <TestForm values={{ test: 'bar' }}>
          <TextArea name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Select', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
      }
      mount(
        <TestForm values={{ test: 'bar' }}>
          <Select name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Text', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
      }
      mount(
        <TestForm values={{ test: 'bar' }}>
          <Text name='test' value='foo'/>
        </TestForm>
      )
    })

    it('Checkbox', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: true
          })
          done()
        }
      }
      mount(
        <TestForm values={{ test: true }}>
          <Checkbox name='test'/>
        </TestForm>
      )
    })

  })

})
