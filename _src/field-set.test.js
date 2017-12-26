import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, toRoute, mountWith } from './__test__'
import * as Form from './form'
import * as Field from './field'
import * as FieldSet from './field-set'
import * as FieldArray from './field-array'
import * as SuperControl from './super-control'

describe('FieldSet.Model', () => {

  describe('state', () => {

    it('is the state of the model', () => {
      const model = FieldSet.Model.create()
      expect(model.state).to.deep.equal({
        init: {},
        value: {},
        blurs: 0,
        visits: 0,
        touched: {},
        visited: {},
        error: null,
        notice: null
      })
    })

  })

  describe('register', () => {

    it('registers a child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.fields.foo).to.equal(field)
      expect(fieldSet.fields.foo).to.be.an.instanceOf(Field.Model)
    })

    it('registers a child fieldSet', () => {
      const parent = FieldSet.Model.create(null, {})
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      parent.register(['foo'], child)
      expect(parent.fields.foo).to.equal(child)
      expect(parent.fields.foo).to.be.an.instanceOf(FieldSet.Model)
    })

    it('registers a grandchild field', () => {
      const parent = FieldSet.Model.create(null, {})
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, {}, toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      expect(parent.fields.foo.fields.bar).to.equal(grandchild)
      expect(parent.fields.foo.fields.bar).to.be.an.instanceOf(Field.Model)
    })

  })

  describe('patch', () => {

    it('patches its own state', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.patch([], { value: { foo: 'bar' } })
      expect(fieldSet.state).to.deep.include({
        value: { foo: 'bar' }
      })
    })

    it('patches the state of descendant fields', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(null, '', toRoute('foo'))
      fieldSet
        .register(['foo'], field)
        .patch(['foo'], { value: 'bar' })
      expect(fieldSet.state).to.deep.include({
        value: { foo: 'bar' }
      })
      expect(field.state).to.include({
        value: 'bar'
      })
    })

    it('tracks the visits of descendant fields', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet
        .register(['foo'], field)
        .patch(['foo'], { isVisited: true })
      expect(fieldSet.state).to.include({ visits: 1 })
    })

    it('tracks the blurs of descendant fields', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet
        .register(['foo'], field)
        .patch(['foo'], { isTouched: true })
      expect(fieldSet.state).to.include({ blurs: 1 })
    })

  })

  describe('getField', () => {

    it('returns a registered child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.getField(['foo'])).to.equal(field)
    })

    it('returns a registered granchild field', () => {
      const parent = FieldSet.Model.create(null, {})
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, {}, toRoute('foo.bar'))
      parent
        .register(child.names, child)
        .register(grandchild.names, grandchild)
      expect(parent.getField(grandchild.names)).to.equal(grandchild)
    })

    it('returns null if a field is not registered', () => {
      const parent = FieldSet.Model.create(null, {})
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, {}, toRoute('foo.bar'))
      parent.register(child.names, child)
      expect(parent.getField(grandchild.names)).to.equal(null)
    })

  })

  describe('unregister', () => {

    it('unregisters a child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.fields.foo).to.equal(field)
      fieldSet.unregister(['foo'])
      expect(fieldSet.fields.foo).to.equal(void 0)
    })

    it('unsets the state of a child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.state).to.deep.include({
        init: { foo: '' },
        value: { foo: '' },
        touched: { foo: false },
        visited: { foo: false }
      })
      fieldSet.unregister(['foo'])
      expect(fieldSet.state).to.deep.include({
        init: {},
        value: {},
        touched: {},
        visited: {}
      })
    })

    it('unregisters a child fieldSet', () => {
      const parent = FieldSet.Model.create(null, {})
      parent.root = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      parent.register(child.names, child)
      expect(parent.fields.foo).to.equal(child)
    })

    it('unregisters a grandchild field', () => {
      const parent = FieldSet.Model.create(null, {})
      parent.root = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      expect(parent.fields.foo.fields.bar).to.equal(grandchild)
      parent.unregister(grandchild.names)
      expect(parent.fields.foo.fields.bar).to.equal(void 0)
    })

    it('unsets the state of a grandchild field', () => {
      const parent = FieldSet.Model.create(null, {})
      parent.root = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      expect(parent.state).to.deep.include({
        init: { foo: { bar: '' } },
        value: { foo: { bar: '' } },
        touched: { foo: { bar: false } },
        visited: { foo: { bar: false } }
      })
      parent.unregister(['foo', 'bar'])
      expect(parent.state).to.deep.include({
        init: { foo: {} },
        value: { foo: {} },
        touched: { foo: {} },
        visited: { foo: {} }
      })
    })

  })

  describe('change', () => {

    it('sets the value of the given field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const fieldArray = FieldArray.Model.create(fieldSet, [], toRoute('bar'))
      const field = Field.Model.create(fieldSet, '', toRoute('bar[0]'))
      fieldSet
        .register(['bar'], fieldArray)
        .register(['bar', 0], field)
      fieldSet.change('bar[0]', 'test')
      expect(fieldSet.state.value.bar[0]).to.equal('test')
      expect(fieldSet.fields.bar.state.value[0]).to.equal('test')
      expect(fieldSet.fields.bar.fields[0].state.value).to.equal('test')
    })

  })

  describe('touch', () => {

    it('marks the given field as touched', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const fieldArray = FieldArray.Model.create(fieldSet, [], toRoute('bar'))
      const field = Field.Model.create(fieldSet, '', toRoute('bar[0]'))
      fieldSet
        .register(['bar'], fieldArray)
        .register(['bar', 0], field)
        .touch('bar[0]')
      expect(fieldSet.state.touched.bar[0]).to.equal(true)
      expect(fieldSet.fields.bar.state.touched[0]).to.equal(true)
      expect(fieldSet.fields.bar.fields[0].state.isTouched).to.equal(true)
    })

  })

  describe('untouch', () => {

    it('unmarks the given field as touched', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const fieldArray = FieldArray.Model.create(fieldSet, [], toRoute('bar'))
      const field = Field.Model.create(fieldSet, '', toRoute('bar[0]'))
      fieldSet
        .register(['bar'], fieldArray)
        .register(['bar', 0], field)
        .touch('bar[0]')
      expect(fieldSet.state.touched.bar[0]).to.equal(true)
      expect(fieldSet.fields.bar.state.touched[0]).to.equal(true)
      expect(fieldSet.fields.bar.fields[0].state.isTouched).to.equal(true)
      fieldSet.untouch('bar[0]')
      expect(fieldSet.state.touched.bar[0]).to.equal(false)
      expect(fieldSet.fields.bar.state.touched[0]).to.equal(false)
      expect(fieldSet.fields.bar.fields[0].state.isTouched).to.equal(false)
    })

  })

  describe('touchAll', () => {

    it('marks all child fields as touched', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      fieldSet
        .register(['foo'], Field.Model.create(fieldSet, [], toRoute('foo')))
        .register(['bar'], Field.Model.create(fieldSet, '', toRoute('bar')))
        .register(['baz'], Field.Model.create(fieldSet, '', toRoute('baz')))
        .touchAll()
      expect(fieldSet.fields.foo.state.isTouched).to.equal(true)
      expect(fieldSet.fields.bar.state.isTouched).to.equal(true)
      expect(fieldSet.fields.baz.state.isTouched).to.equal(true)
    })

  })

})

describe('FieldSet.View', () => {

  let form
  let mount

  beforeEach(() => {
    form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('render', () => {

    it('renders a fieldset element by default', () => {
      const wrapper = mount(<FieldSet.View name='test'/>)
      expect(wrapper).to.have.tagName('fieldset')
    })

    it('renders and registers child SuperControls', () => {
      const wrapper = mount(
        <FieldSet.View name='test'>
          <SuperControl.View name='child' render={_ => <noscript/>}/>
        </FieldSet.View>
      )
      expect(wrapper).to.contain(<noscript/>)
      const { model } = wrapper.instance()
      expect(model.fields.child).to.be.an.instanceOf(SuperControl.Model)
    })

    it('passes a fields prop to its component', done => {
      const test = ({ fields }) => {
        expect(fields).to.deep.include({
          name: 'test',
          path: 'test',
          init: {},
          values: {},
          error: null,
          notice: null,
          isValid: true,
          hasError: false,
          isInvalid: false,
          hasNotice: false,
          anyTouched: false
        })
        expect(fields.touch).to.be.a('function')
        expect(fields.change).to.be.a('function')
        expect(fields.untouch).to.be.a('function')
        expect(fields.touchAll).to.be.a('function')
        done()
        return null
      }
      mount(<FieldSet.View name='test' component={test}/>)
    })

  })

  describe('prop', () => {

    describe('anyTouched', () => {

      it('is true if any of its descendant fields are touched', () => {
        const wrapper = mount(<FieldSet.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ anyTouched: false })
        view.model.setState({ touched: { foo: true } })
        expect(view.prop).to.include({ anyTouched: true })
      })

    })

    describe('isFocused', () => {

      it('is true if a descendant field is focused', () => {
        const wrapper = mount(<FieldSet.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isFocused: false })
        view.model.setState({ visits: 1 })
        expect(view.prop).to.include({ isFocused: true })
        view.model.setState({ blurs: 1 })
        expect(view.prop).to.include({ isFocused: false })
      })

    })

  })

})
