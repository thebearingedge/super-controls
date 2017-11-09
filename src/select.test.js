import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import Option from './option'
import Wrapped, { Select as Control } from './select'

describe('Select', () => {

  describe('Control', () => {

    it('renders a select element', () => {
      const select = mount(<Control/>)
      expect(select).to.have.tagName('select')
    })

    it('has an empty value by default', () => {
      const select = mount(<Control/>)
      expect(select).to.have.value('')
    })

    it('registers a change handler', () => {
      const handleChange = _ => _
      const select = mount(<Control handleChange={handleChange}/>)
      const { onChange } = select.find('select').props()
      expect(onChange).to.equal(handleChange)
    })

  })

  describe('Wrapped', () => {

    let context

    beforeEach(() => {
      context = { setValue: spy(), getValue: stub() }
    })

    it('reads its value from context', () => {
      context.getValue.returns('foo')
      const select = mount(
        <Wrapped name='test'>
          <Option value='foo'/>
        </Wrapped>,
        { context }
      )
      expect(select).to.have.value('foo')
    })

    it('updates its parent form on change', () => {
      context.getValue.returns('foo')
      const select = mount(
        <Wrapped name='test'>
          <Option value='foo'/>
          <Option value='bar'/>
        </Wrapped>,
        { context }
      )
      const target = select.getDOMNode()
      target.value = 'bar'
      select.simulate('change', { target })
      expect(context.setValue).to.have.been.calledWith({ test: 'bar' })
    })

  })

})
