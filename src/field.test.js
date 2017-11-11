import React from 'react'
import { describe, before, it } from 'mocha'
import { mount, expect } from './__test__'
import field from './field'
import controlled from './controlled'
import { RadioGroup as Group } from './radio-group'
import Radio from './radio'

describe('field', () => {

  let Text
  let TextField
  let Checkbox
  let CheckboxField
  let Select
  let SelectField
  let RadioGroup
  let RadioGroupField

  before(() => {
    Text = controlled('text')
    TextField = field(Text)
    Checkbox = controlled('checkbox')
    CheckboxField = field(Checkbox)
    Select = controlled('select')
    SelectField = field(Select)
    RadioGroup = controlled(Group)
    RadioGroupField = field(RadioGroup)
  })

  describe('reads its initial value state from props', () => {

    it('Text', () => {
      const field = mount(<TextField name='test' value='foo'/>)
      expect(field).to.have.state('value', 'foo')
    })

    it('Checkbox', () => {
      const field = mount(<CheckboxField name='test' checked/>)
      expect(field).to.have.state('value', true)
    })

    it('Select', () => {
      const field = mount(
        <SelectField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>
      )
      expect(field).to.have.state('value', 'foo')
    })

    it('RadioGroup', () => {
      const field = mount(
        <RadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>
      )
      expect(field).to.have.state('value', 'foo')
    })

  })

  describe('renders its target', () => {

    it('Text', () => {
      const field = mount(<TextField name='test'/>)
      expect(field).to.have.exactly(1).descendants(Text)
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

    it('Text', () => {
      const field = mount(<TextField name='test' value='foo'/>)
      const text = field.find(Text)
      expect(text).to.have.value('foo')
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

  describe('passes a change handler to its target', () => {

    it('Text', () => {
      const field = mount(<TextField name='test'/>)
      const text = field.find(Text)
      const { onChange } = field.instance()
      expect(onChange).to.be.a('function')
      expect(text).to.have.props({ onChange })
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

  describe('updates its state when changed', () => {

    it('Text', done => {
      class TestTextField extends TextField {
        componentDidUpdate() {
          expect(field).to.have.state('value', 'foo')
          done()
        }
      }
      const field = mount(<TestTextField name='test'/>)
      const text = field.find(Text)
      const target = Object.assign(text.getDOMNode(), { value: 'foo' })
      text.simulate('change', { target })
    })

    it('Checkbox', done => {
      class TestCheckboxField extends CheckboxField {
        componentDidUpdate() {
          expect(field).to.have.state('value', true)
          done()
        }
      }
      const field = mount(<TestCheckboxField name='test'/>)
      const checkbox = field.find(Checkbox)
      const target = Object.assign(checkbox.getDOMNode(), { checked: true })
      checkbox.simulate('change', { target })
    })

    it('Select', done => {
      class TestSelectField extends SelectField {
        componentDidUpdate() {
          expect(field).to.have.state('value', 'foo')
          done()
        }
      }
      const field = mount(
        <TestSelectField name='test'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </TestSelectField>
      )
      const select = field.find(Select)
      const target = Object.assign(select.getDOMNode(), { value: 'foo' })
      select.simulate('change', { target })
    })

    it('RadioGroup', done => {
      class TestRadioGroupField extends RadioGroupField {
        componentDidUpdate() {
          expect(field).to.have.state('value', 'baz')
          done()
        }
      }
      const field = mount(
        <TestRadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </TestRadioGroupField>
      )
      const baz = field.find('[type="radio"][value="baz"]')
      const target = baz.getDOMNode()
      baz.simulate('change', { target })
    })

  })

  describe('updates is value state via context', () => {

    it('Text', done => {
      const setValue = value => {
        expect(value).to.deep.equal({ test: 'foo' })
        done()
      }
      const context = { setValue }
      const field = mount(<TextField name='test'/>, { context })
      const text = field.find(Text)
      const target = Object.assign(text.getDOMNode(), { value: 'foo' })
      text.simulate('change', { target })
    })

    it('Checkbox', done => {
      const setValue = value => {
        expect(value).to.deep.equal({ test: true })
        done()
      }
      const context = { setValue }
      const field = mount(<CheckboxField name='test'/>, { context })
      const checkbox = field.find(Checkbox)
      const target = Object.assign(checkbox.getDOMNode(), { checked: true })
      checkbox.simulate('change', { target })
    })

    it('Select', done => {
      const setValue = value => {
        expect(value).to.deep.equal({ test: 'foo' })
        done()
      }
      const context = { setValue }
      const field = mount(
        <SelectField name='test'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </SelectField>,
        { context }
      )
      const select = field.find(Select)
      const target = Object.assign(select.getDOMNode(), { value: 'foo' })
      select.simulate('change', { target })
    })

    it('RadioGroup', done => {
      const setValue = value => {
        expect(value).to.deep.equal({ test: 'baz' })
        done()
      }
      const context = { setValue }
      const field = mount(
        <RadioGroupField name='test' value='foo'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </RadioGroupField>,
        { context }
      )
      const baz = field.find('[type="radio"][value="baz"]')
      const target = baz.getDOMNode()
      baz.simulate('change', { target })
    })

  })

  describe('does not re-render its target with the same value', () => {

    const message = 'Field components should not re-render the same state.'

    it('Text', done => {
      class TestText extends Text {
        componentDidUpdate() {
          throw new Error(message)
        }
      }
      class TestField extends field(TestText) {
        componentDidUpdate() {
          done()
        }
      }
      const testField = mount(<TestField name='test'/>)
      const testText = testField.find(TestText)
      const target = testText.getDOMNode()
      testText.simulate('change', { target })
    })

    it('Checkbox', done => {
      class TestCheckbox extends Checkbox {
        componentDidUpdate() {
          throw new Error(message)
        }
      }
      class TestField extends field(TestCheckbox) {
        componentDidUpdate() {
          done()
        }
      }
      const testField = mount(<TestField name='test'/>)
      const testCheckbox = testField.find(TestCheckbox)
      const target = testCheckbox.getDOMNode()
      testCheckbox.simulate('change', { target })
    })

    it('Select', done => {
      class TestSelect extends Select {
        componentDidUpdate() {
          throw new Error(message)
        }
      }
      class TestField extends field(TestSelect) {
        componentDidUpdate() {
          done()
        }
      }
      const testField = mount(
        <TestField name='test' value='foo'>
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>
          <option value='baz'>Baz</option>
        </TestField>
      )
      const testSelect = testField.find(TestSelect)
      const target = testSelect.getDOMNode()
      testSelect.simulate('change', { target })
    })

    it('RadioGroup', done => {
      class TestRadioGroup extends RadioGroup {
        componentDidUpdate() {
          throw new Error(message)
        }
      }
      class TestField extends field(TestRadioGroup) {
        componentDidUpdate() {
          done()
        }
      }
      const testField = mount(
        <TestField name='test' value='baz'>
          <Radio value='foo'/>
          <Radio value='bar'/>
          <Radio value='baz'/>
        </TestField>
      )
      const baz = testField.find('[type="radio"][value="baz"]')
      const target = baz.getDOMNode()
      baz.simulate('change', { target })
    })

  })

})
