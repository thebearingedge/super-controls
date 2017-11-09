import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import Wrapped, { Checkbox as Control } from './checkbox'

describe('Checkbox', () => {

  describe('Control', () => {

    it('renders a checkbox', () => {
      const checkbox = mount(<Control/>)
      expect(checkbox.find('input')).to.have.attr('type', 'checkbox')
    })

    it('is not checked by default', () => {
      const checkbox = mount(<Control/>)
      expect(checkbox).not.to.be.checked()
    })

    it('registers a change handler', () => {
      const handleChange = _ => _
      const checkbox = mount(<Control handleChange={handleChange}/>)
      const { onChange } = checkbox.find('input').props()
      expect(onChange).to.equal(handleChange)
    })

  })

  describe('Wrapped', () => {

    let context

    beforeEach(() => {
      context = { setValue: spy(), getValue: stub() }
    })

    describe('when the form contains its value', () => {

      it('does not register itself when mounted', () => {
        context.getValue.returns(true)
        mount(<Wrapped name='test'/>, { context })
        expect(context.setValue).to.have.callCount(0)
      })

    })

    describe('when the form does not contain its value', () => {

      it('registers itself when mounted', () => {
        mount(<Wrapped name='test'/>, { context })
        expect(context.setValue).to.have.been.calledWith({ test: false })
      })

    })

    describe('when it is not checked', () => {

      it('updates to checked', () => {
        const checkbox = mount(<Wrapped name='test'/>, { context })
        const target = checkbox.getDOMNode()
        target.checked = true
        checkbox.simulate('change', { target })
        expect(context.setValue).to.have.been.calledWith({ test: true })
      })

    })

    describe('when it is checked', () => {

      it('updates to unchecked', () => {
        context.getValue.resolves(true)
        const checkbox = mount(<Wrapped name='test'/>, { context })
        const target = checkbox.getDOMNode()
        target.checked = false
        checkbox.simulate('change', { target })
        expect(context.setValue).to.have.been.calledWith({ test: false })
      })

    })

  })

})
