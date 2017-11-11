import React from 'react'
import { describe, before, beforeEach, it } from 'mocha'
import { mount, expect, spy } from './__test__'
import controlled from './controlled'
import { RadioGroup as Group } from './radio-group'
import Radio from './radio'

describe('controlled', () => {

  let props

  beforeEach(() => {
    props = { name: 'test', onChange: spy() }
  })

  describe('Input', () => {

    let Input

    before(() => {
      Input = controlled('input')
    })

    it('renders an input element', () => {
      const input = mount(<Input {...props}/>)
      expect(input).to.have.tagName('input')
      expect(input).not.to.have.attr('type')
    })

    it('is empty by default', () => {
      const text = mount(<Input {...props}/>)
      expect(text).to.have.value('')
    })

    it('copies its name to its id when id is true', () => {
      const input = mount(<Input id {...props}/>)
      expect(input).to.have.tagName('input')
      expect(input).to.have.attr('id', 'test')
    })

    it('forwards its value prop to its element', () => {
      const input = mount(<Input {...props} value='foo'/>)
      expect(input).to.have.value('foo')
    })

    it('calls a change handler', () => {
      const input = mount(<Input {...props}/>)
      const target = input.getDOMNode()
      input.simulate('change', { target })
      expect(props.onChange).to.have.callCount(1)
    })

  })

  describe('Hidden', () => {

    let Hidden

    before(() => {
      Hidden = controlled('hidden')
    })

    it('renders a hidden input element', () => {
      const hidden = mount(<Hidden {...props}/>)
      expect(hidden).to.have.tagName('input')
      expect(hidden).to.have.attr('type', 'hidden')
    })

  })

  describe('Radio', () => {

    let context

    beforeEach(() => {
      context = { onChange: spy() }
    })

    it('renders a radio input element', () => {
      const radio = mount(<Radio name='test' value='foo'/>, { context })
      expect(radio).to.have.tagName('input')
      expect(radio).to.have.attr('type', 'radio')
    })

    it('is not checked by default', () => {
      const radio = mount(<Radio value='foo'/>, { context })
      expect(radio).not.to.be.checked()
    })

    it('is checked when its value matches its group', () => {
      context.groupValue = 'foo'
      const radio = mount(<Radio value='foo'/>, { context })
      expect(radio).to.be.checked()
    })

    it('calls a change handler from context', () => {
      const radio = mount(<Radio value='foo'/>, { context })
      const target = radio.getDOMNode()
      radio.simulate('change', { target })
      expect(context.onChange).to.have.callCount(1)
    })

  })

  describe('RadioGroup', () => {

    let RadioGroup

    before(() => {
      RadioGroup = controlled(Group)
    })

    it('is empty by default', () => {
      const group = mount(<RadioGroup {...props}/>)
      expect(group).to.have.prop('value', '')
    })

    it('renders its children', () => {
      const group = mount(
        <RadioGroup {...props}>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroup>
      )
      expect(group).to.have.exactly(3).descendants(Radio)
    })

    it('passes a change handler to its radios via context', () => {
      const group = mount(
        <RadioGroup {...props}>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroup>
      )
      group.find('[type="radio"]').forEach(radio => {
        expect(radio).to.have.prop('onChange', props.onChange)
      })
    })

    it('passes its name to its radios via context', () => {
      const group = mount(
        <RadioGroup {...props}>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroup>
      )
      group.find(Radio).forEach(radio => {
        expect(radio).to.have.attr('name', 'test')
      })
    })

    it('passes its value to its radios via context', () => {
      const group = mount(
        <RadioGroup value='baz' {...props}>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroup>
      )
      const baz = group.find('[type="radio"][value="baz"]')
      expect(baz).to.be.checked()
    })

  })

  describe('Checkbox', () => {

    let Checkbox

    before(() => {
      Checkbox = controlled('checkbox')
    })

    it('renders a checkbox input element', () => {
      const checkbox = mount(<Checkbox {...props}/>)
      expect(checkbox).to.have.tagName('input')
      expect(checkbox).to.have.attr('type', 'checkbox')
    })

    it('is not checked by default', () => {
      const checkbox = mount(<Checkbox {...props}/>)
      expect(checkbox).not.to.be.checked()
    })

    it('forwards its value prop to its input', () => {
      const checkbox = mount(<Checkbox {...props} checked/>)
      expect(checkbox).to.be.checked()
    })

    it('calls a change handler', () => {
      const checkbox = mount(<Checkbox {...props}/>)
      const target = checkbox.getDOMNode()
      checkbox.simulate('change', { target })
      expect(props.onChange).to.have.callCount(1)
    })

  })

  describe('TextArea', () => {

    let TextArea

    before(() => {
      TextArea = controlled('textarea')
    })

    it('renders a textarea element', () => {
      const area = mount(<TextArea {...props}/>)
      expect(area).to.have.tagName('textarea')
    })

  })

  describe('Select', () => {

    let Select

    before(() => {
      Select = controlled('select')
    })

    it('renders a select element with children', () => {
      const select = mount(
        <Select {...props}>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </Select>
      )
      expect(select).to.have.exactly(3).descendants('option')
    })

  })

})
