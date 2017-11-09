import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import Wrapped, { TextInput as Control } from './text-input'

describe('TextInput', () => {

  describe('Control', () => {

    it('renders a text input', () => {
      const input = mount(<Control name='test'/>)
      expect(input).to.have.attr('type', 'text')
    })

    it('is empty by default', () => {
      const input = mount(<Control name='test'/>)
      expect(input).to.have.value('')
    })

    it('registers a change handler', () => {
      const handleChange = _ => _
      const input = mount(<Control name='test' handleChange={handleChange}/>)
      const { onChange } = input.find('input').props()
      expect(onChange).to.be.a('function')
    })

  })

  describe('Wrapped', () => {

    let context

    beforeEach(() => {
      context = { setValue: spy(), getValue: stub() }
    })

    it('sets its value via context', () => {
      mount(<Wrapped name='test' value='foo'/>, { context })
      expect(context.setValue).to.have.been.calledWith({ test: 'foo' })
    })

    it('reads its value from context', () => {
      context.getValue.returns('foo')
      const input = mount(<Wrapped name='test'/>, { context })
      expect(input).to.have.value('foo')
    })

    it('updates its parent form on change', () => {
      const input = mount(<Wrapped name='test' value='foo'/>, { context })
      const target = input.getDOMNode()
      target.value = 'foo'
      input.simulate('change', { target })
      expect(context.setValue).to.have.been.calledWith({ test: 'foo' })
    })

  })

})
