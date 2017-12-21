import { describe, beforeEach, it } from 'mocha'
import { expect, stub } from './__test__'
import * as Field from './field'

describe('Field.Model', () => {

  let form

  beforeEach(() => {
    form = { values: { foo: 'bar' }, update: stub(), state: {} }
  })

  describe('state', () => {

    it('returns the state of the field', () => {
      const { state } = Field.Model.create(form)
      expect(state).to.deep.equal({
        error: null,
        notice: null,
        init: void 0,
        value: void 0,
        isTouched: false,
        isVisited: false
      })
    })

  })

  describe('prop', () => {

    it('includes the field\'s current state', () => {
      const { prop } = Field.Model.create(form)
      expect(prop).to.include({
        name: null,
        error: null,
        notice: null,
        init: void 0,
        value: void 0,
        isTouched: false,
        isVisited: false
      })
    })

    describe('isFocused', () => {

      it('true if the form currently has focus on the field', () => {
        const field = Field.Model.create(form)
        expect(field.prop).to.include({ isFocused: false })
        form.state.focused = field
        expect(field.prop).to.include({ isFocused: true })
      })

    })

    describe('update', () => {

      it('updates the field state through the form', () => {
        const field = Field.Model.create(form)
        form.update.callsFake((...args) => field.update(...args))
        field.prop.update({ value: 'foo' })
        expect(field.state).to.deep.equal({
          error: null,
          notice: null,
          init: void 0,
          value: 'foo',
          isTouched: false,
          isVisited: false
        })
      })

      it('overrides the value being sent to the form', () => {
        const field = Field.Model.create(form, void 0, [], {
          override: (value, values) => {
            return values.foo === 'bar' ? 'baz' : value
          }
        })
        form.update.callsFake((...args) => field.update(...args))
        field.prop.update({ value: 'foo' })
        expect(field.state).to.deep.equal({
          error: null,
          notice: null,
          init: void 0,
          value: 'baz',
          isTouched: false,
          isVisited: false
        })
      })

      it('bypasses the override if options.force is set to true', () => {
        const field = Field.Model.create(form, void 0, [], {
          override: (value, values) => {
            return values.foo === 'bar' ? 'baz' : value
          }
        })
        form.update.callsFake((...args) => field.update(...args))
        field.prop.update({ value: 'foo' }, { force: true })
        expect(field.state).to.deep.equal({
          error: null,
          notice: null,
          init: void 0,
          value: 'foo',
          isTouched: false,
          isVisited: false
        })
      })

    })

  })

})
