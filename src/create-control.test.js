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
    },
    setTouched() {}
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

  describe('forwards value changes to its form field', () => {

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

  describe('forwards touch changes to its form field', () => {

    it('Input', () => {
      const field = stubField('')
      spy(field, 'setTouched')
      registerField.returns(field)
      const input = mount(
        <Input name='test'/>,
        { context }
      )
      input.simulate('blur')
      expect(field.setTouched).to.have.callCount(1)
    })

    it('TextArea', () => {
      const field = stubField('')
      spy(field, 'setTouched')
      registerField.returns(field)
      const textArea = mount(
        <TextArea name='test'/>,
        { context }
      )
      textArea.simulate('blur')
      expect(field.setTouched).to.have.callCount(1)
    })

    it('Select', () => {
      const field = stubField('')
      spy(field, 'setTouched')
      registerField.returns(field)
      const select = mount(
        <Select name='test'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      select.simulate('blur')
      expect(field.setTouched).to.have.callCount(1)
    })

    it('Text', () => {
      const field = stubField('')
      spy(field, 'setTouched')
      registerField.returns(field)
      const text = mount(
        <Text name='test'/>,
        { context }
      )
      text.simulate('blur')
      expect(field.setTouched).to.have.callCount(1)
    })

    it('Checkbox', () => {
      const field = stubField(false)
      spy(field, 'setTouched')
      registerField.returns(field)
      const checkbox = mount(
        <Checkbox name='test'/>,
        { context }
      )
      checkbox.simulate('blur')
      expect(field.setTouched).to.have.callCount(1)
    })

    it('RadioGroup', () => {
      const field = stubField('')
      spy(field, 'setTouched')
      registerField.returns(field)
      const radioGroup = mount(
        <RadioGroup name='test'>
          <Radio value='foo'/>
          <Radio value='bar'/>
        </RadioGroup>,
        { context }
      )
      const bar = radioGroup.find('input[value="bar"]')
      bar.simulate('change')
      expect(field.setTouched).to.have.callCount(1)
    })

  })

  describe('syncronizes itself with its form field', () => {

    it('Input', done => {
      registerField.returns(stubField('foo'))
      const input = mount(
        <Input name='test' value='foo'/>,
        { context }
      )
      stub(input.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(input).to.have.state('value', 'foo')
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      input.setState({ value: 'bar' })
    })

    it('TextArea', done => {
      registerField.returns(stubField('foo'))
      const textArea = mount(
        <TextArea name='test' value='foo'/>,
        { context }
      )
      stub(textArea.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(textArea).to.have.state('value', 'foo')
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      textArea.setState({ value: 'bar' })
    })

    it('Select', done => {
      registerField.returns(stubField('baz'))
      const select = mount(
        <Select name='test' value='baz'>
          <option value='foo'></option>
          <option value='bar'></option>
          <option value='baz'></option>
        </Select>,
        { context }
      )
      stub(select.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(select).to.have.state('value', 'baz')
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      select.setState({ value: 'bar' })
    })

    it('Text', done => {
      registerField.returns(stubField('foo'))
      const text = mount(
        <Text name='test' value='foo'/>,
        { context }
      )
      stub(text.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(text).to.have.state('value', 'foo')
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      text.setState({ value: 'bar' })
    })

    it('Checkbox', done => {
      registerField.returns(stubField(false))
      const checkbox = mount(
        <Checkbox name='test'/>,
        { context }
      )
      stub(checkbox.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(checkbox).to.have.state('value', false)
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      checkbox.setState({ value: true })
    })

    it('RadioGroup', done => {
      registerField.returns(stubField('foo'))
      const radioGroup = mount(
        <RadioGroup name='test'>
          <Radio value='foo'/>
          <Radio value='bar'/>
        </RadioGroup>,
        { context }
      )
      stub(radioGroup.instance(), 'componentDidUpdate')
        .callThrough()
        .onCall(1)
        .callsFake(() => {
          expect(radioGroup).to.have.state('value', 'foo')
          done()
        })
        .onCall(2)
        .callsFake(() => {
          done(new Error('cascading calls to setState detected'))
        })
      radioGroup.setState({ value: 'bar' })
    })

  })

})
