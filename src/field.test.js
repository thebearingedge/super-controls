import React from 'react'
import { describe, before, beforeEach, it } from 'mocha'
import { mount, expect, stub } from './__test__'
import field from './field'
import controlled from './controlled'
import { RadioGroup as Group } from './radio-group'
import Radio from './radio'

describe('field', () => {

  let Input
  let InputField
  let Checkbox
  let CheckboxField
  let Select
  let SelectField
  let RadioGroup
  let RadioGroupField

  before(() => {
    Input = controlled('input')
    InputField = field(Input)()
    Checkbox = controlled('checkbox')
    CheckboxField = field(Checkbox)()
    Select = controlled('select')
    SelectField = field(Select)()
    RadioGroup = controlled(Group)
    RadioGroupField = field(RadioGroup)()
  })

  describe('renders its target', () => {

    it('Input', () => {
      const field = mount(<InputField name='test'/>)
      expect(field).to.have.exactly(1).descendants(Input)
    })

    it('Checkbox', () => {
      const field = mount(<CheckboxField name='test'/>)
      expect(field).to.have.exactly(1).descendants(Checkbox)
    })

    it('Select', () => {
      const field = mount(
        <SelectField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>
      )
      expect(field).to.have.exactly(1).descendants(Select)
    })

    it('RadioGroup', () => {
      const field = mount(
        <RadioGroupField name='test'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>
      )
      expect(field).to.have.exactly(3).descendants(Radio)
    })

  })

  describe('passes a value prop to its target', () => {

    it('Input', () => {
      const field = mount(<InputField name='test' value='foo'/>)
      const input = field.find(Input)
      expect(input).to.have.value('foo')
    })

    it('Checkbox', () => {
      const field = mount(<CheckboxField name='test' checked/>)
      const checkbox = field.find(Checkbox)
      expect(checkbox).to.be.checked()
    })

    it('Select', () => {
      const field = mount(
        <SelectField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>
      )
      const select = field.find(Select)
      expect(select).to.have.value('foo')
    })

    it('RadioGroup', () => {
      const field = mount(
        <RadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>
      )
      const group = field.find(RadioGroup)
      expect(group).to.have.value('foo')
    })

  })

  describe('prefers to get its value from context', () => {

    let context

    beforeEach(() => {
      context = { getValue: stub() }
    })

    it('Input', () => {
      context.getValue.returns('bar')
      const field = mount(<InputField name='test' value='foo'/>, { context })
      const input = field.find(Input)
      expect(input).to.have.value('bar')
      expect(context.getValue).to.have.callCount(1)
      expect(context.getValue).to.have.been.calledWith('test')
    })

    it('Checkbox', () => {
      context.getValue.returns(true)
      const field = mount(<CheckboxField name='test'/>, { context })
      const checkbox = field.find(Checkbox)
      expect(checkbox).to.be.checked()
      expect(context.getValue).to.have.callCount(1)
      expect(context.getValue).to.have.been.calledWith('test')
    })

    it('Select', () => {
      context.getValue.returns('baz')
      const field = mount(
        <SelectField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>,
        { context }
      )
      const select = field.find(Select)
      expect(select).to.have.value('baz')
      expect(context.getValue).to.have.callCount(1)
      expect(context.getValue).to.have.been.calledWith('test')
    })

    it('RadioGroup', () => {
      context.getValue.returns('baz')
      const field = mount(
        <RadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>,
        { context }
      )
      expect(field.find('input[value="foo"]')).not.to.be.checked()
      expect(field.find('input[value="bar"]')).not.to.be.checked()
      expect(field.find('input[value="baz"]')).to.be.checked()
      expect(context.getValue).to.have.callCount(1)
      expect(context.getValue).to.have.been.calledWith('test')
    })

  })

  describe('passes a change handler to its target', () => {

    it('Input', () => {
      const field = mount(<InputField name='test'/>)
      const input = field.find(Input)
      const { onChange } = field.instance()
      expect(onChange).to.be.a('function')
      expect(input).to.have.props({ onChange })
    })

    it('Checkbox', () => {
      const field = mount(<CheckboxField name='test'/>)
      const checkbox = field.find(Checkbox)
      const { onChange } = field.instance()
      expect(onChange).to.be.a('function')
      expect(checkbox).to.have.props({ onChange })
    })

    it('Select', () => {
      const field = mount(
        <SelectField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>
      )
      const select = field.find(Select)
      const { onChange } = field.instance()
      expect(onChange).to.be.a('function')
      expect(select).to.have.props({ onChange })
    })

    it('RadioGroup', () => {
      const field = mount(
        <RadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>
      )
      const group = field.find(RadioGroup)
      const { onChange } = field.instance()
      expect(onChange).to.be.a('function')
      expect(group).to.have.props({ onChange })
    })

  })

})
