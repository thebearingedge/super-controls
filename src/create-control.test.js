import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, spy } from './__test__'
import Input from './input'
import TextArea from './text-area'
import Text from './text'
import Checkbox from './checkbox'
import Select from './select'

function mockField(value) {
  return {
    state: {
      get value() {
        return value
      }
    },
    setValue(_value) {
      value = _value
    }
  }
}

describe('createControl', () => {

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  describe('renders its target', () => {

    it('Input', () => {
      registerField.returns(mockField('foo'))
      const input = mount(
        <Input name='test' value='foo'/>,
        { context }
      )
      expect(input).to.have.tagName('input')
      expect(input).not.to.have.attr('type')
      expect(input).to.have.value('foo')
    })

    it('TextArea', () => {
      registerField.returns(mockField('foo'))
      const textArea = mount(
        <TextArea name='test' value='foo'/>,
        { context }
      )
      expect(textArea).to.have.tagName('textarea')
      expect(textArea).to.have.value('foo')
    })

    it('Text', () => {
      registerField.returns(mockField('foo'))
      const text = mount(
        <Text name='test' value='foo'/>,
        { context }
      )
      expect(text).to.have.tagName('input')
      expect(text).to.have.attr('type', 'text')
      expect(text).to.have.value('foo')
    })

    it('Checkbox', () => {
      registerField.returns(mockField(true))
      const checkbox = mount(
        <Checkbox name='test' checked/>,
        { context }
      )
      expect(checkbox).to.have.tagName('input')
      expect(checkbox).to.have.attr('type', 'checkbox')
      expect(checkbox).to.be.checked()
    })

    it('Select', () => {
      registerField.returns(mockField('baz'))
      const select = mount(
        <Select name='test' value='baz'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      expect(select).to.have.tagName('select')
      expect(select).to.have.value('baz')
      expect(select.find('option[value="baz"]')).to.be.selected()
    })

  })

  describe('registers itself via context', () => {

    it('Input', () => {
      registerField.returns(mockField('foo'))
      const input = mount(
        <Input name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test'
      })
      expect(input).to.have.state('value', 'foo')
    })

    it('TextArea', () => {
      registerField.returns(mockField('foo'))
      const textArea = mount(
        <TextArea name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test'
      })
      expect(textArea).to.have.state('value', 'foo')
    })

    it('Text', () => {
      registerField.returns(mockField('foo'))
      const text = mount(
        <Text name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test'
      })
      expect(text).to.have.state('value', 'foo')
    })

    it('Checkbox', () => {
      registerField.returns(mockField(true))
      const checkbox = mount(
        <Checkbox name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test'
      })
      expect(checkbox).to.be.checked()
    })

    it('Select', () => {
      registerField.returns(mockField('baz'))
      const select = mount(
        <Select name='test' value='foo'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      expect(select).to.have.value('baz')
      expect(registerField).to.have.been.calledWith({
        name: 'test'
      })
      expect(select.find('option[value="baz"]')).to.be.selected()
    })

  })

  describe('updates its state and field', () => {

    it('Input', done => {
      const field = mockField('')
      spy(field, 'setValue')
      registerField.returns(field)
      class TestInput extends Input {
        componentDidUpdate() {
          expect(field.setValue).to.have.been.calledWith('foo')
          expect(input).to.have.value('foo')
          done()
        }
      }
      const input = mount(
        <TestInput name='test'/>,
        { context }
      )
      const target = Object.assign(input.getDOMNode(), { value: 'foo' })
      input.simulate('change', { target })
    })

    it('TextArea', done => {
      const field = mockField('')
      spy(field, 'setValue')
      registerField.returns(field)
      class TestTextArea extends TextArea {
        componentDidUpdate() {
          expect(field.setValue).to.have.been.calledWith('foo')
          expect(textArea).to.have.value('foo')
          done()
        }
      }
      const textArea = mount(
        <TestTextArea name='test'/>,
        { context }
      )
      const target = Object.assign(textArea.getDOMNode(), { value: 'foo' })
      textArea.simulate('change', { target })
    })

    it('Text', done => {
      const field = mockField('')
      spy(field, 'setValue')
      registerField.returns(field)
      class TestText extends Text {
        componentDidUpdate() {
          expect(field.setValue).to.have.been.calledWith('foo')
          expect(text).to.have.value('foo')
          done()
        }
      }
      const text = mount(
        <TestText name='test'/>,
        { context }
      )
      const target = Object.assign(text.getDOMNode(), { value: 'foo' })
      text.simulate('change', { target })
    })

    it('Checkbox', done => {
      const field = mockField(false)
      spy(field, 'setValue')
      registerField.returns(field)
      class TestCheckbox extends Checkbox {
        componentDidUpdate() {
          expect(field.setValue).to.have.been.calledWith(true)
          expect(checkbox).be.checked()
          done()
        }
      }
      const checkbox = mount(
        <TestCheckbox name='test'/>,
        { context }
      )
      const target = Object.assign(checkbox.getDOMNode(), { checked: true })
      checkbox.simulate('change', { target })
    })

    it('Select', done => {
      const field = mockField('')
      spy(field, 'setValue')
      registerField.returns(field)
      class TestSelect extends Select {
        componentDidUpdate() {
          expect(field.setValue).to.have.been.calledWith('foo')
          expect(select.find('option[value="foo"]')).to.be.selected()
          done()
        }
      }
      const select = mount(
        <TestSelect name='test'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </TestSelect>,
        { context }
      )
      const target = Object.assign(select.getDOMNode(), { value: 'foo' })
      select.simulate('change', { target })
    })

  })

  describe('does not update when its state matches its field state', () => {

    it('Input', done => {
      registerField.returns(mockField('foo'))
      class TestInput extends Input {
        componentDidUpdate() {
          done()
        }
      }
      const input = mount(
        <TestInput name='test' value='foo'/>,
        { context }
      )
      const target = input.getDOMNode()
      input.simulate('change', { target })
      input.setProps({ id: true })
    })

    it('TextArea', done => {
      registerField.returns(mockField('foo'))
      class TestTextArea extends TextArea {
        componentDidUpdate() {
          done()
        }
      }
      const textArea = mount(
        <TestTextArea name='test'/>,
        { context }
      )
      const target = textArea.getDOMNode()
      textArea.simulate('change', { target })
      textArea.setProps({ id: true })
    })

    it('Text', done => {
      registerField.returns(mockField('foo'))
      class TestText extends Text {
        componentDidUpdate() {
          done()
        }
      }
      const text = mount(
        <TestText name='test'/>,
        { context }
      )
      const target = text.getDOMNode()
      text.simulate('change', { target })
      text.setProps({ id: true })
    })

    it('Checkbox', done => {
      registerField.returns(mockField(false))
      class TestCheckbox extends Checkbox {
        componentDidUpdate() {
          done()
        }
      }
      const checkbox = mount(
        <TestCheckbox name='test'/>,
        { context }
      )
      const target = checkbox.getDOMNode()
      checkbox.simulate('change', { target })
      checkbox.setProps({ id: true })
    })

    it('Select', done => {
      registerField.returns(mockField('foo'))
      class TestSelect extends Select {
        componentDidUpdate() {
          done()
        }
      }
      const select = mount(
        <TestSelect name='test'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </TestSelect>,
        { context }
      )
      const target = select.getDOMNode()
      select.simulate('change', { target })
      select.setProps({ id: true })
    })

  })

})
