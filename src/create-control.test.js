import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, spy } from './__test__'
import Input from './input'
import TextArea from './text-area'
import Select from './select'
import Text from './text'
import Checkbox from './checkbox'
import RadioGroup from './radio-group'
import Radio from './radio'

function stubField(value) {
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
      registerField.returns(stubField('foo'))
      const input = mount(
        <Input name='test' value='foo'/>,
        { context }
      )
      expect(input).to.have.tagName('input')
      expect(input).not.to.have.attr('type')
      expect(input).to.have.value('foo')
    })

    it('TextArea', () => {
      registerField.returns(stubField('foo'))
      const textArea = mount(
        <TextArea name='test' value='foo'/>,
        { context }
      )
      expect(textArea).to.have.tagName('textarea')
      expect(textArea).to.have.value('foo')
    })

    it('Select', () => {
      registerField.returns(stubField('baz'))
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

    it('Text', () => {
      registerField.returns(stubField('foo'))
      const text = mount(
        <Text name='test' value='foo'/>,
        { context }
      )
      expect(text).to.have.tagName('input')
      expect(text).to.have.attr('type', 'text')
      expect(text).to.have.value('foo')
    })

    it('Checkbox', () => {
      registerField.returns(stubField(true))
      const checkbox = mount(
        <Checkbox name='test' checked/>,
        { context }
      )
      expect(checkbox).to.have.tagName('input')
      expect(checkbox).to.have.attr('type', 'checkbox')
      expect(checkbox).to.be.checked()
    })

    it('RadioGroup', () => {
      registerField.returns(stubField('foo'))
      const radioGroup = mount(
        <RadioGroup name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
        </RadioGroup>,
        { context }
      )
      const foo = radioGroup.find('input[value="foo"]')
      const bar = radioGroup.find('input[value="bar"]')
      expect(foo).to.be.checked()
      expect(bar).not.to.be.checked()
    })

  })

  describe('registers itself via context', () => {

    it('Input', () => {
      registerField.returns(stubField('foo'))
      const input = mount(
        <Input name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: ''
      })
      expect(input).to.have.state('value', 'foo')
    })

    it('TextArea', () => {
      registerField.returns(stubField('foo'))
      const textArea = mount(
        <TextArea name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: ''
      })
      expect(textArea).to.have.state('value', 'foo')
    })

    it('Select', () => {
      registerField.returns(stubField('baz'))
      const select = mount(
        <Select name='test' value=''>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      expect(select).to.have.value('baz')
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: ''
      })
      expect(select.find('option[value="baz"]')).to.be.selected()
    })

    it('Text', () => {
      registerField.returns(stubField('foo'))
      const text = mount(
        <Text name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: ''
      })
      expect(text).to.have.state('value', 'foo')
    })

    it('Checkbox', () => {
      registerField.returns(stubField(true))
      const checkbox = mount(
        <Checkbox name='test'/>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: false
      })
      expect(checkbox).to.be.checked()
    })

    it('RadioGroup', () => {
      registerField.returns(stubField('foo'))
      const radioGroup = mount(
        <RadioGroup name='test'>
          <Radio value='foo'/>
          <Radio value='bar'/>
        </RadioGroup>,
        { context }
      )
      expect(registerField).to.have.been.calledWith({
        name: 'test',
        value: ''
      })
      const foo = radioGroup.find('input[value="foo"]')
      const bar = radioGroup.find('input[value="bar"]')
      expect(foo).to.be.checked()
      expect(bar).not.to.be.checked()
    })

  })

  describe('forwards changes to its form field', () => {

    it('Input', () => {
      const field = stubField('')
      spy(field, 'setValue')
      registerField.returns(field)
      const input = mount(
        <Input name='test'/>,
        { context }
      )
      const target = Object.assign(input.getDOMNode(), { value: 'foo' })
      input.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith('foo')

    })

    it('TextArea', () => {
      const field = stubField('')
      spy(field, 'setValue')
      registerField.returns(field)
      const textArea = mount(
        <TextArea name='test'/>,
        { context }
      )
      const target = Object.assign(textArea.getDOMNode(), { value: 'foo' })
      textArea.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith('foo')
    })

    it('Select', () => {
      const field = stubField('')
      spy(field, 'setValue')
      registerField.returns(field)
      const select = mount(
        <Select name='test'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      const target = Object.assign(select.getDOMNode(), { value: 'foo' })
      select.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith('foo')
    })

    it('Text', () => {
      const field = stubField('')
      spy(field, 'setValue')
      registerField.returns(field)
      const text = mount(
        <Text name='test'/>,
        { context }
      )
      const target = Object.assign(text.getDOMNode(), { value: 'foo' })
      text.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith('foo')
    })

    it('Checkbox', () => {
      const field = stubField(false)
      spy(field, 'setValue')
      registerField.returns(field)
      const checkbox = mount(
        <Checkbox name='test'/>,
        { context }
      )
      const target = Object.assign(checkbox.getDOMNode(), { checked: true })
      checkbox.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith(true)
    })

    it('RadioGroup', () => {
      const field = stubField('foo')
      spy(field, 'setValue')
      registerField.returns(field)
      const radioGroup = mount(
        <RadioGroup name='test'>
          <Radio value='foo'/>
          <Radio value='bar'/>
        </RadioGroup>,
        { context }
      )
      const bar = radioGroup.find('input[value="bar"]')
      const target = bar.getDOMNode()
      bar.simulate('change', { target })
      expect(field.setValue).to.have.been.calledWith('bar')
    })

  })

})
