import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, spy, stub } from './__test__'
import Wrapped, { Hidden as Control } from './hidden'

describe('Hidden', () => {

  describe('Control', () => {

    it('renders a hidden input', () => {
      const hidden = mount(<Control/>)
      expect(hidden.find('input')).to.have.attr('type', 'hidden')
    })

    it('is empty by default', () => {
      const hidden = mount(<Control/>)
      expect(hidden).to.have.value('')
    })

  })

  describe('Wrapped', () => {

    let context

    beforeEach(() => {
      context = { setValue: spy(), getValue: stub() }
    })

    it('reads its value from context', () => {
      context.getValue.returns('foo')
      const hidden = mount(<Wrapped name='test'/>, { context })
      expect(hidden).to.have.value('foo')
    })

    describe('when the form contains its value', () => {

      it('does not register itself when mounted', () => {
        context.getValue.returns('foo')
        mount(<Wrapped name='test'/>, { context })
        expect(context.setValue).to.have.callCount(0)
      })

    })

    describe('when the form does not contain its value', () => {

      it('registers itself when mounted', () => {
        mount(<Wrapped name='test' value='foo'/>, { context })
        expect(context.setValue).to.have.been.calledWith({ test: 'foo' })
      })

    })

  })

})
