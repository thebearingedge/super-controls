import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, stub } from './__test__'
import Form from './form'
import Input from './input'
import TextArea from './text-area'
import Select from './select'
import Text from './text'
import Checkbox from './checkbox'
import RadioGroup from './radio-group'
import Radio from './radio'

describe('Form', () => {

  describe('registers descendant fields', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: '', isTouched: false })
          done()
        }
      }
      mount(
        <TestForm>
          <Input name='test'/>
        </TestForm>
      )
    })

    it('TextArea', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: '', isTouched: false })
          done()
        }
      }
      mount(
        <TestForm>
          <TextArea name='test'/>
        </TestForm>
      )
    })

    it('Select', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: '', isTouched: false })
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
            .that.deep.equals({ value: '', isTouched: false })
          done()
        }
      }
      mount(
        <TestForm>
          <TextArea name='test'/>
        </TestForm>
      )
    })

    it('Checkbox', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: false, isTouched: false })
          done()
        }
      }
      mount(
        <TestForm>
          <Checkbox name='test'/>
        </TestForm>
      )
    })

    it('RadioGroup', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.fields.test)
            .to.have.property('state')
            .that.deep.equals({ value: '', isTouched: false })
          done()
        }
      }
      mount(
        <TestForm>
          <RadioGroup name='test'>
            <Radio value='foo'/>
            <Radio value='bar'/>
          </RadioGroup>
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

    it('RadioGroup', done => {
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
          <RadioGroup name='test' value='foo'>
            <Radio value='foo'/>
            <Radio value='bar'/>
          </RadioGroup>
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
        componentDidUpdate() {
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
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
        componentDidUpdate() {
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
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
        componentDidUpdate() {
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
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
        componentDidUpdate() {
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
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: true
          })
          done()
        }
        componentDidUpdate() {
          done()
        }
      }
      mount(
        <TestForm values={{ test: true }}>
          <Checkbox name='test'/>
        </TestForm>
      )
    })

    it('RadioGroup', done => {
      class TestForm extends Form {
        componentDidMount() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
        componentDidUpdate() {
          done()
        }
      }
      mount(
        <TestForm values={{ test: 'bar' }}>
          <RadioGroup name='test' value='foo'>
            <Radio value='foo'/>
            <Radio value='bar'/>
          </RadioGroup>
        </TestForm>
      )
    })

  })

  describe('receives value updates from its descendants', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'foo'
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Input name='test'/>
        </TestForm>
      )
      const input = form.find(Input)
      const target = Object.assign(input.getDOMNode(), { value: 'foo' })
      input.simulate('change', { target })
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
      const form = mount(
        <TestForm values={{ test: '' }}>
          <TextArea name='test'/>
        </TestForm>
      )
      const textArea = form.find(TextArea)
      const target = Object.assign(textArea.getDOMNode(), { value: 'foo' })
      textArea.simulate('change', { target })
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
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Select name='test'>
            <option value='foo'></option>
            <option value='bar'></option>
            <option value='baz'></option>
          </Select>
        </TestForm>
      )
      const select = form.find(Select)
      const target = Object.assign(select.getDOMNode, { value: 'foo' })
      select.simulate('change', { target })
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
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Text name='test'/>
        </TestForm>
      )
      const text = form.find(Text)
      const target = Object.assign(text.getDOMNode(), { value: 'foo' })
      text.simulate('change', { target })
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
      const form = mount(
        <TestForm values={{ test: false }}>
          <Checkbox name='test'/>
        </TestForm>
      )
      const checkbox = form.find(Checkbox)
      const target = Object.assign(checkbox.getDOMNode(), { checked: true })
      checkbox.simulate('change', { target })
    })

    it('RadioGroup', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.values).to.deep.equal({
            test: 'bar'
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: 'foo' }}>
          <RadioGroup name='test' value='foo'>
            <Radio value='foo'/>
            <Radio value='bar'/>
          </RadioGroup>
        </TestForm>
      )
      const bar = form.find('input[value="bar"]')
      const target = bar.getDOMNode()
      bar.simulate('change', { target })
    })

  })

  describe('receives touch updates from its descendants', () => {

    it('Input', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Input name='test'/>
        </TestForm>
      )
      form.find(Input).simulate('blur')
    })

    it('TextArea', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: '' }}>
          <TextArea name='test'/>
        </TestForm>
      )
      form.find(TextArea).simulate('blur')
    })

    it('Select', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Select name='test'>
            <option value='foo'></option>
            <option value='bar'></option>
            <option value='baz'></option>
          </Select>
        </TestForm>
      )
      form.find(Select).simulate('blur')
    })

    it('Text', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: '' }}>
          <Text name='test'/>
        </TestForm>
      )
      form.find(Text).simulate('blur')
    })

    it('Checkbox', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: false }}>
          <Checkbox name='test'/>
        </TestForm>
      )
      form.find(Checkbox).simulate('blur')
    })

    it('RadioGroup', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state.touched).to.deep.equal({
            test: true
          })
          done()
        }
      }
      const form = mount(
        <TestForm values={{ test: 'foo' }}>
          <RadioGroup name='test' value='foo'>
            <Radio value='foo'/>
            <Radio value='bar'/>
          </RadioGroup>
        </TestForm>
      )
      form.find('input[value="bar"]').simulate('change')
    })

  })

  describe('resets to its initial state', () => {

    it('', done => {
      class TestForm extends Form {
        componentDidUpdate() {}
      }
      const form = mount(
        <TestForm values={{ test: 'foo' }}/>
      )
      stub(form.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(form)
            .to.have.state('values')
            .that.deep.equals({ test: 'foo' })
          done()
        })
      form.setState({ values: { test: 'bar' } }, () => {
        form.simulate('reset')
      })
    })

  })

  describe('calls an onSubmit prop with its values', () => {

    it('', () => {
      const onSubmit = stub()
      const form = mount(
        <Form values={{ test: 'foo' }} onSubmit={onSubmit}/>
      )
      form.simulate('submit')
      expect(onSubmit).to.have.been.calledWith({
        test: 'foo'
      })
    })

  })

})
