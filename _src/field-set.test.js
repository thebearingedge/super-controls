import { describe, beforeEach, it } from 'mocha'
import { expect, stub, toRoute } from './__test__'
import * as FieldSet from './field-set'
import * as Field from './field'

describe('FieldSet.Model', () => {

  let form

  beforeEach(() => {
    form = { update: stub(), state: {} }
  })

  it('returns the state of the fieldArray', () => {
    const { state } = FieldSet.Model.create(form)
    expect(state).to.deep.equal({
      visits: 0,
      touched: {},
      visited: {},
      error: null,
      notice: null,
      init: void 0,
      value: void 0
    })
  })

  describe('register', () => {

    it('registers a child field', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      fieldSet.register(field.names, field)
      expect(fieldSet.fields.foo).to.equal(field)
    })

    it('registers a child fieldSet', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      parent.register(child.names, child)
      expect(parent.fields.foo).to.equal(child)
    })

    it('registers a grandchild field', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, {}, toRoute('foo.bar'))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.fields.foo.fields.bar).to.equal(grandchild)
    })

  })

  describe('update', () => {

    it('updates its state with a child\'s state', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      form.update.callsFake((...args) => fieldSet.update(...args))
      fieldSet.register(field.names, field)
      expect(fieldSet.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: '' },
        value: { foo: '' },
        touched: { foo: false },
        visited: { foo: false }
      })
    })

    it('tracks visits of child fields', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      form.update.callsFake((...args) => fieldSet.update(...args))
      fieldSet.register(field.names, field)
      field.prop.update({ isFocused: true })
      expect(fieldSet.state).to.include({
        visits: 1
      })
    })

    it('updates its state when its descendants register', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, '', toRoute('foo.bar'))
      form.update.callsFake((...args) => parent.update(...args))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: { bar: '' } },
        value: { foo: { bar: '' } },
        touched: { foo: { bar: false } },
        visited: { foo: { bar: false } }
      })
      expect(child.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { bar: '' },
        value: { bar: '' },
        touched: { bar: false },
        visited: { bar: false }
      })
      expect(grandchild.state).to.deep.equal({
        init: '',
        value: '',
        error: null,
        notice: null,
        isTouched: false,
        isVisited: false
      })
    })

  })

  describe('getField', () => {

    it('returns a registered child field', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      fieldSet.register(field.names, field)
      expect(fieldSet.getField(field.names)).to.equal(field)
    })

    it('returns a registered granchild field', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, {}, toRoute('foo.bar'))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.getField(grandchild.names)).to.equal(grandchild)
    })

    it('returns null if a field is not registered', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, {}, toRoute('foo.bar'))
      parent
        .register(child.names, child)
      expect(parent.getField(grandchild.names)).to.equal(null)
    })

  })

  describe('unregister', () => {

    it('unregisters a child field', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      form.update.callsFake((...args) => fieldSet.update(...args))
      fieldSet.register(field.names, field)
      expect(fieldSet.fields.foo).to.equal(field)
      fieldSet.unregister(field.names)
      expect(fieldSet.fields).not.to.have.property('foo')
    })

    it('unsets the state of a child field', () => {
      const fieldSet = FieldSet.Model.create(form, {})
      const field = Field.Model.create(form, '', toRoute('foo'))
      form.update.callsFake((...args) => fieldSet.update(...args))
      fieldSet.register(field.names, field)
      expect(fieldSet.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: '' },
        value: { foo: '' },
        touched: { foo: false },
        visited: { foo: false }
      })
      fieldSet.unregister(field.names)
      expect(fieldSet.state).to.deep.equal({
        init: {},
        value: {},
        visits: 0,
        touched: {},
        visited: {},
        error: null,
        notice: null
      })
    })

    it('unregisters a child fieldSet', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      parent.register(child.names, child)
      expect(parent.fields.foo).to.equal(child)
    })

    it('unregisters a grandchild field', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, {}, toRoute('foo.bar'))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.fields.foo.fields.bar).to.equal(grandchild)
      parent.unregister(grandchild.names)
      expect(parent.fields.foo.fields).not.to.have.property('bar')
    })

    it('unsets the state of a grandchild field', () => {
      const parent = FieldSet.Model.create(form, {})
      const child = FieldSet.Model.create(form, {}, toRoute('foo'))
      const grandchild = Field.Model.create(form, '', toRoute('foo.bar'))
      form.update.callsFake((...args) => parent.update(...args))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: { bar: '' } },
        value: { foo: { bar: '' } },
        touched: { foo: { bar: false } },
        visited: { foo: { bar: false } }
      })
      expect(child.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { bar: '' },
        value: { bar: '' },
        touched: { bar: false },
        visited: { bar: false }
      })
      parent.unregister(grandchild.names)
      expect(parent.state).to.deep.equal({
        visits: 0,
        error: null,
        notice: null,
        init: { foo: {} },
        value: { foo: {} },
        touched: { foo: {} },
        visited: { foo: {} }
      })
      expect(child.state).to.deep.equal({
        init: {},
        value: {},
        visits: 0,
        touched: {},
        visited: {},
        error: null,
        notice: null
      })
    })

  })

  describe('prop', () => {

    describe('anyTouched', () => {

      it('true if any of the fieldSet\'s child fields are touched', () => {
        const parent = FieldSet.Model.create(form, {})
        const child = FieldSet.Model.create(form, {}, toRoute('foo'))
        const grandchild = Field.Model.create(form, {}, toRoute('foo.bar'))
        form.update.callsFake((...args) => parent.update(...args))
        parent
          .register(child.names, child)
          .register(grandchild.names, grandchild)
        expect(parent.prop).to.include({ anyTouched: false })
        parent.update(grandchild.names, { isTouched: true })
        expect(parent.prop).to.include({ anyTouched: true })
      })

    })

  })

})
