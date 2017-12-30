import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, toRoute, mountWith } from './__test__'
import * as Form from './form'
import * as Field from './field'
import * as FieldSet from './field-set'
import * as FieldArray from './field-array'
import * as SuperControl from './super-control'

describe('FieldSet.Model', () => {

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
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      expect(parent.fields.foo.fields.bar).to.equal(grandchild)
      expect(parent.fields.foo.fields.bar).to.be.an.instanceOf(Field.Model)
    })

  })

  describe('getState', () => {

    describe('anyTouched', () => {

      it('is true if any of its descendant fields are touched', () => {
        const fieldSet = FieldSet.Model.create()
        fieldSet.root = fieldSet
        const field = Field.Model.create(fieldSet, '', toRoute('foo'))
        fieldSet.register(['foo'], field)
        expect(fieldSet.getState()).to.include({ anyTouched: false })
        field.update({ touches: 1 })
        expect(fieldSet.getState()).to.include({ anyTouched: true })
      })

    })

    describe('anyVisited', () => {

      it('is true if any of its descendant fields are touched', () => {
        const fieldSet = FieldSet.Model.create()
        fieldSet.root = fieldSet
        const field = Field.Model.create(fieldSet, '', toRoute('foo'))
        fieldSet.register(['foo'], field)
        expect(fieldSet.getState()).to.include({ anyVisited: false })
        field.update({ visits: 1 })
        expect(fieldSet.getState()).to.include({ anyVisited: true })
      })

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
        .patch(['foo'], { visits: 1 })
      expect(fieldSet.state).to.include({ visits: 1 })
    })

    it('tracks the touches of descendant fields', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet
        .register(['foo'], field)
        .patch(['foo'], { touches: 1 })
      expect(fieldSet.state).to.include({ touches: 1 })
    })

    it('tracks isActive of descendant fields', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet
        .register(['foo'], field)
        .patch(['foo'], { visits: 1 })
      expect(fieldSet.state).to.include({ isActive: true })
      fieldSet.patch(['foo'], { touches: 1 })
      expect(fieldSet.state).to.include({ isActive: false })
    })

  })

  describe('broadcast', () => {

    it('calls subscribers on itself and all descendants', done => {
      const parent = FieldSet.Model.create(null, {})
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      const subscriber = stub()
        .onCall(5).callsFake(() => done())
        .onCall(6).callsFake(() => done())
      parent.subscribe(subscriber)
      child.subscribe(subscriber)
      grandchild.subscribe(subscriber)
      parent.broadcast()
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
      parent.register(child.names, child)
      const unregistered = parent.getField(['foo', 'bar'])
      expect(unregistered).to.equal(null)
    })

    it('returns null if the names list is too long', () => {
      const parent = FieldSet.Model.create(null, {})
      const child = Field.Model.create(parent, {}, toRoute('foo'))
      parent.register(child.names, child)
      const unregistered = parent.getField(['foo', 'bar'])
      expect(unregistered).to.equal(null)
    })

  })

  describe('unregister', () => {

    it('unregisters a child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.fields.foo).to.equal(field)
      fieldSet.unregister(['foo'], field)
      expect(fieldSet.fields.foo).to.equal(void 0)
    })

    it('unsets the state of a child field', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      const field = Field.Model.create(fieldSet, '', toRoute('foo'))
      fieldSet.register(['foo'], field)
      expect(fieldSet.state).to.deep.include({
        init: { foo: '' },
        value: { foo: '' }
      })
      fieldSet.unregister(['foo'], field)
      expect(fieldSet.state).to.deep.include({
        init: {},
        value: {}
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
      parent.unregister(['foo', 'bar'], grandchild)
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
        value: { foo: { bar: '' } }
      })
      parent.unregister(['foo', 'bar'], grandchild)
      expect(parent.state).to.deep.include({
        init: { foo: {} },
        value: { foo: {} }
      })
    })

    it('unregisters subtrees of fields', () => {
      const parent = FieldSet.Model.create(null, {})
      parent.root = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      parent.unregister(['foo'], child)
      expect(parent.fields).to.deep.equal({})
      expect(parent.state).to.deep.include({
        init: {},
        value: {}
      })
    })

    it('does not throw if a detached field unregisters', () => {
      const parent = FieldSet.Model.create(null, {})
      parent.root = parent
      const child = FieldSet.Model.create(parent, {}, toRoute('foo'))
      const grandchild = Field.Model.create(parent, '', toRoute('foo.bar'))
      parent
        .register(['foo'], child)
        .register(['foo', 'bar'], grandchild)
      parent.unregister(['foo'])
      expect(() => parent.unregister(['foo', 'bar'])).not.to.throw()
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
      expect(fieldSet.state.touches).to.equal(1)
      expect(fieldSet.fields.bar.state.touches).to.equal(1)
      expect(fieldSet.fields.bar.fields[0].state.touches).to.equal(1)
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
        .patch(['bar', 0], { touches: 1 })
        .patch(['bar', 0], { touches: 1 })
      expect(fieldSet.state.touches).to.equal(2)
      expect(fieldSet.fields.bar.state.touches).to.equal(2)
      expect(fieldSet.fields.bar.fields[0].state.touches).to.equal(2)
      fieldSet.untouch('bar[0]')
      expect(fieldSet.state.touches).to.equal(0)
      expect(fieldSet.fields.bar.state.touches).to.equal(0)
      expect(fieldSet.fields.bar.fields[0].state.touches).to.equal(0)
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
      expect(fieldSet.fields.foo.state.touches).to.equal(1)
      expect(fieldSet.fields.bar.state.touches).to.equal(1)
      expect(fieldSet.fields.baz.state.touches).to.equal(1)
    })

  })

  describe('untouchAll', () => {

    it('unmarks all child fields as touched', () => {
      const fieldSet = FieldSet.Model.create(null, {})
      fieldSet.root = fieldSet
      fieldSet
        .register(['foo'], Field.Model.create(fieldSet, [], toRoute('foo')))
        .register(['bar'], Field.Model.create(fieldSet, '', toRoute('bar')))
        .register(['baz'], Field.Model.create(fieldSet, '', toRoute('baz')))
        .touchAll()
      fieldSet.untouchAll()
      expect(fieldSet.fields.foo.state.touches).to.equal(0)
      expect(fieldSet.fields.bar.state.touches).to.equal(0)
      expect(fieldSet.fields.baz.state.touches).to.equal(0)
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

  describe('componentWillReceiveProps', () => {

    it('defers updates of its name field', done => {
      const foo = form.register({
        init: {},
        route: toRoute('foo'),
        Model: FieldSet.Model
      })
      class TestFieldSet extends FieldSet.View {
        componentDidUpdate() {
          expect(this.state).to.deep.equal(foo.getState())
          done()
        }
      }
      const wrapper = mount(<TestFieldSet name='bar'/>)
      wrapper.setProps({ name: 'foo' })
    })

  })

  describe('shouldComponentUpdate', () => {

    it('ignores shallow equal values', () => {
      class TestFieldSet extends FieldSet.View {
        componentDidUpdate() {
          throw new Error('did not ignore values')
        }
      }
      const wrapper = mount(<TestFieldSet name='test'/>)
      wrapper.setState({ values: {} })
    })

    it('ignores shallow equal initial values', () => {
      class TestFieldSet extends FieldSet.View {
        componentDidUpdate() {
          throw new Error('did not ignore init')
        }
      }
      const wrapper = mount(<TestFieldSet name='test'/>)
      wrapper.setState({ init: {} })
    })

  })

  describe('render', () => {

    it('renders a fieldset element by default', () => {
      const wrapper = mount(<FieldSet.View name='test'/>)
      expect(wrapper).to.have.tagName('fieldset')
    })

    it('registers and renders child SuperControls', () => {
      const wrapper = mount(
        <FieldSet.View name='test'>
          <SuperControl.View name='child' render={_ => <noscript/>}/>
        </FieldSet.View>
      )
      const { model } = wrapper.instance()
      expect(model.fields.child).to.be.an.instanceOf(SuperControl.Model)
      expect(wrapper).to.contain(<noscript/>)
    })

    it('passes a fields prop to its component', done => {
      const test = ({ fields }) => {
        expect(fields).to.be.an('object')
        done()
        return null
      }
      mount(<FieldSet.View name='test' component={test}/>)
    })

  })

  describe('prop', () => {

    it('includes the model\'s state and methods', () => {
      const wrapper = mount(<FieldSet.View name='test'/>)
      const { prop } = wrapper.instance()
      expect(prop).to.include(wrapper.state())
      expect(prop.touch).to.be.a('function')
      expect(prop.change).to.be.a('function')
      expect(prop.untouch).to.be.a('function')
      expect(prop.touchAll).to.be.a('function')
      expect(prop.untouchAll).to.be.a('function')
    })

  })

})
