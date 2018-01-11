import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, mountWith } from './__test__'
import * as Form from './form'
import * as SuperControl from './super-control'

describe('SuperControl.Model', () => {

  describe('name', () => {

    it('is null by default', () => {
      const model = SuperControl.Model.create()
      expect(model.name).to.equal(null)
    })

    it('is the last name in the model\'s route', () => {
      const model = SuperControl.Model.create(null, null, 'foo[0]')
      expect(model.name).to.equal(0)
    })

  })

  describe('names', () => {

    it('is the list of names in the model\'s hierarchy', () => {
      const named = SuperControl.Model.create(null, null, 'foo[0]')
      expect(named.names).to.deep.equal(['foo', 0])
      const unnamed = SuperControl.Model.create()
      expect(unnamed.names).to.deep.equal([])
    })

  })

  describe('path', () => {

    it('is a string notation of the model\'s path', () => {
      const named = SuperControl.Model.create(null, null, 'foo[0].bar')
      expect(named.path).to.equal('foo[0].bar')
      const unnamed = SuperControl.Model.create()
      expect(unnamed.path).to.equal('')
    })

  })

  describe('getState', () => {

    it('returns the current state of the model', () => {
      const model = SuperControl.Model.create()
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: null,
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

  })

  describe('subscribe', () => {

    it('subscribes listeners to state updates', () => {
      const model = SuperControl.Model.create()
      model.subscribe(() => {})
      model.subscribe(() => {})
      expect(model.subscribers).to.equal(2)
    })

    it('returns an unsubscribe function', () => {
      const model = SuperControl.Model.create()
      const unsubscribe = model.subscribe(() => {})
      expect(unsubscribe).to.be.a('function')
    })

    it('unregisters when the last subscriber unsubscribes', () => {
      const form = { _unregister: stub(), state: {} }
      const model = SuperControl.Model.create(form, null, 'foo')
      const unsubscribe = model.subscribe(_ => {})
      unsubscribe()
      expect(form._unregister).to.have.been.calledWith(['foo'], model)
    })

  })

  describe('publish', () => {

    it('calls subscribers with the state of the model', done => {
      const model = SuperControl.Model.create()
      const subscriber = stub()
        .onCall(0).callsFake(state => {
          expect(state).to.deep.equal(model.getState())
        })
        .onCall(1).callsFake(state => {
          expect(state).to.deep.equal(model.getState())
          done()
        })
      model.subscribe(subscriber)
      model.publish()
    })

  })

  describe('validate', () => {

    let form

    beforeEach(() => {
      form = { values: {} }
    })

    it('sets the isValidated state of the model', () => {
      const model = SuperControl.Model.create(form)
      expect(model.getState()).to.include({
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false
      })
      model.validate()
      expect(model.getState()).to.include({
        error: null,
        notice: null,
        isValid: true,
        isInvalid: false,
        isValidated: true,
        isValidating: false
      })
    })

    it('sets the error state of the model', () => {
      const model = SuperControl.Model.create(form, null, 'foo', {
        validate(value, values, self, root) {
          expect(value).to.equal(null)
          expect(values).to.equal(form.values)
          expect(self).to.equal(model)
          expect(root).to.equal(form)
          return { error: 'foo cannot be null' }
        }
      })
      model.validate()
      expect(model.getState()).to.include({
        notice: null,
        isValid: false,
        isInvalid: true,
        isValidated: true,
        isValidating: false,
        error: 'foo cannot be null'
      })
    })

    it('sets the notice state of the model', () => {
      const model = SuperControl.Model.create(form, 'bar', 'foo', {
        validate(value, values, self, root) {
          expect(value).to.equal('bar')
          expect(values).to.equal(form.values)
          expect(self).to.equal(model)
          expect(root).to.equal(form)
          return { notice: 'bar is a good foo' }
        }
      })
      model.validate()
      expect(model.getState()).to.include({
        error: null,
        isValid: true,
        hasNotice: true,
        isInvalid: false,
        isValidated: true,
        isValidating: false,
        notice: 'bar is a good foo'
      })
    })

    it('sets the isValidating state of the model', done => {
      const model = SuperControl.Model.create(form, 'bar', 'foo', {
        validate() {
          return Promise.resolve({ notice: 'bar is a good foo' })
        }
      })
      const subscriber = stub()
        .onCall(1).callsFake(state => {
          expect(state).to.include({
            error: null,
            notice: null,
            isValid: false,
            isInvalid: false,
            isValidated: false,
            isValidating: true
          })
        })
        .onCall(2).callsFake(state => {
          expect(state).to.include({
            error: null,
            isValid: true,
            isInvalid: false,
            isValidated: true,
            isValidating: false,
            notice: 'bar is a good foo'
          })
          done()
        })
        .onCall(3).callsFake(_ => done())
      model.subscribe(subscriber)
      model.validate()
    })

    it('only sets messages from the most recent async validation', done => {
      const validate = stub()
        .onCall(0).resolves({ error: 'bad' })
        .onCall(1).resolves({ error: null })
      const model = SuperControl.Model.create(form, null, 'foo', {
        validate
      })
      const subscriber = stub()
        .onCall(0).callsFake(state => {
          expect(state).to.include({
            error: null,
            isValid: false,
            isValidating: false
          })
        })
        .onCall(1).callsFake(state => {
          expect(state).to.include({
            error: null,
            isValid: false,
            isValidating: true
          })
        })
        .onCall(2).callsFake(state => {
          expect(state).to.include({
            error: null,
            isValid: false,
            isValidating: true
          })
        })
        .onCall(3).callsFake(state => {
          expect(state).to.include({
            error: null,
            isValid: true,
            isValidating: false
          })
          done()
        })
        .onCall(4).callsFake(_ => done())
      model.subscribe(subscriber)
      model.validate()
      model.validate()
    })

  })

  describe('_setState', () => {

    it('replaces the state of the model', () => {
      const model = SuperControl.Model.create()
      model._setState({ ...model._state, value: 'foo' })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

    it('publishes the new state of the model', done => {
      const model = SuperControl.Model.create()
      model.subscribe(stub().onCall(1).callsFake(state => {
        expect(state).to.deep.equal({
          path: '',
          name: null,
          init: null,
          value: 'foo',
          error: null,
          notice: null,
          isValid: false,
          isInvalid: false,
          isValidated: false,
          isValidating: false,
          isAsyncValidated: false,
          hasNotice: false,
          isActive: false,
          isInactive: true,
          isVisited: false,
          isTouched: false
        })
        done()
      }))
      model._setState({ ...model._state, value: 'foo' })
    })

    it('silently replaces the state of the model', () => {
      const model = SuperControl.Model.create()
      model
        .subscribe(stub().onCall(1).throws(new Error('setState not silenced')))
      model._setState({ ...model._state, value: 'foo' }, { silent: true })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

  })

  describe('_patch', () => {

    let form

    beforeEach(() => {
      form = { values: { foo: 'foo' } }
    })

    it('patches the value state of the model', () => {
      const model = SuperControl.Model.create()
      model._patch({ value: 'bar' })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'bar',
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

    it('validates a new value state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        validate(value, allValues) {
          if (value === allValues.foo) {
            return { error: 'dupe!' }
          }
        }
      })
      model._patch({ value: 'foo' }, { validate: true })
      expect(model.getState()).to.include({
        value: 'foo',
        notice: null,
        error: 'dupe!',
        isInvalid: true,
        hasNotice: false
      })
    })

    it('patches the isVisited state of the model', () => {
      const model = SuperControl.Model.create()
      model._patch({ visits: 1 })
      expect(model.getState()).to.include({ isVisited: true })
      model._patch({ visits: -1 })
      expect(model.getState()).to.include({ isVisited: false })
    })

    it('patches the isTouched state of the model', () => {
      const model = SuperControl.Model.create()
      model._patch({ touches: 1 })
      expect(model.getState()).to.include({ isTouched: true })
      model._patch({ touches: -1 })
      expect(model.getState()).to.include({ isTouched: false })
    })

    it('patches the isActive state of the model', () => {
      const model = SuperControl.Model.create()
      model._patch({ visits: 1 }, { activate: true })
      expect(model.getState()).to.include({ isActive: true })
      model._patch({ touches: 1 }, { activate: true })
      expect(model.getState()).to.include({ isActive: false })
    })

  })

  describe('initialize', () => {

    let form

    beforeEach(() => {
      form = { _patchField: stub() }
    })

    it('patches the init and value of the model through the form', () => {
      const model = SuperControl.Model.create(form, null, 'foo')
      form._patchField.callsFake((_, ...args) => model._patch(...args))
      expect(model.getState()).to.include({
        init: null,
        value: null
      })
      model.initialize('test')
      expect(model.getState()).to.include({
        init: 'test',
        value: 'test'
      })
    })

  })

  describe('reset', () => {

    let form

    beforeEach(() => {
      form = { _patchField: stub() }
    })

    it('resets the model to its initial state', () => {
      const model = SuperControl.Model.create(form, 'foo')
      form._patchField.callsFake((_, ...args) => model._patch(...args))
      model._patch({
        visits: 1,
        touches: 1,
        value: 'bar',
        error: 'oops',
        isValidated: true
      })
      expect(model.getState()).to.include({
        init: 'foo',
        value: 'bar',
        error: 'oops',
        isVisited: true,
        isTouched: true,
        isValidated: true
      })
      model.reset()
      expect(model.getState()).to.include({
        init: 'foo',
        value: 'foo',
        isVisited: false,
        isTouched: false,
        isValidated: false
      })
    })

  })

  describe('toJSON', () => {

    it('returns the value of the field', () => {
      const model = SuperControl.Model.create(null, 'foo')
      const json = JSON.stringify(model)
      expect(json).to.equal('"foo"')
    })

    it('uses a custom serialize method', () => {
      const model = SuperControl.Model.create(null, 'foo', '', {
        serialize: model => model.value.toUpperCase()
      })
      const json = JSON.stringify(model)
      expect(json).to.equal('"FOO"')
    })

  })

})

describe('SuperControl.View', () => {

  let form
  let mount

  beforeEach(() => {
    form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('componentWillMount', () => {

    it('registers a model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const { model } = wrapper.instance()
      expect(model).to.be.an.instanceOf(SuperControl.Model)
      expect(form.fields.test).to.equal(model)
    })

    it('gets its state from its model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const view = wrapper.instance()
      expect(view.state).to.deep.equal({
        name: 'test',
        path: 'test',
        init: null,
        value: null,
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

    it('subscribes to state updates on its model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const view = wrapper.instance()
      expect(view.state).to.deep.equal({
        name: 'test',
        path: 'test',
        init: null,
        value: null,
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
      view.model._patch({ value: 'test' })
      expect(view.state).to.deep.equal({
        name: 'test',
        path: 'test',
        init: null,
        value: 'test',
        error: null,
        notice: null,
        isValid: false,
        isInvalid: false,
        isValidated: false,
        isValidating: false,
        isAsyncValidated: false,
        hasNotice: false,
        isActive: false,
        isInactive: true,
        isVisited: false,
        isTouched: false
      })
    })

  })

  describe('componentWillUnmount', () => {

    it('unsubscribes the view from its model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const { model } = wrapper.instance()
      expect(model.subscribers).to.equal(1)
      wrapper.unmount()
      expect(model.subscribers).to.equal(0)
    })

  })

  describe('componentWillReceiveProps', () => {

    it('defers updates of its name field', done => {
      const foo = form.register({
        init: null,
        route: 'foo',
        Model: SuperControl.Model
      })
      class TestControl extends SuperControl.View {
        componentDidUpdate() {
          expect(this.state).to.deep.equal(foo.getState())
          done()
        }
      }
      const wrapper = mount(<TestControl name='bar'/>)
      wrapper.setProps({ name: 'foo' })
    })

  })

  describe('shouldComponentUpdate', () => {

    it('ignores updates of a children function', () => {
      const children = _ => {
        throw new Error('did not ignore children')
      }
      const wrapper = mount(
        <SuperControl.View name='test'>
          { _ => null }
        </SuperControl.View>
      )
      wrapper.setProps({ children })
    })

  })

  describe('props', () => {

    describe('validate', () => {

      it('configures its model\'s validate method', () => {
        const validate = _ => {}
        const wrapper = mount(
          <SuperControl.View name='test' validate={validate}/>
        )
        const { model } = wrapper.instance()
        expect(model.config).to.include({ validate })
      })

    })

    describe('notify', () => {

      it('configures its model\'s notify method', () => {
        const notify = _ => {}
        const wrapper = mount(
          <SuperControl.View name='test' notify={notify}/>
        )
        const { model } = wrapper.instance()
        expect(model.config).to.include({ notify })
      })

    })

  })

  describe('render', () => {

    it('calls a render function', done => {
      const test = _ => done() || null
      mount(<SuperControl.View name='test' render={test}/>)
    })

    it('calls a child function', done => {
      const test = _ => done() || null
      mount(
        <SuperControl.View name='test'>
          { test }
        </SuperControl.View>
      )
    })

    it('renders a component function', done => {
      const test = _ => done() || null
      mount(<SuperControl.View name='test' component={test}/>)
    })

    it('renders an component by tagName', () => {
      const wrapper = mount(
        <SuperControl.View name='test' component='noscript'/>
      )
      expect(wrapper).to.have.tagName('noscript')
    })

    it('forwards props to string components', () => {
      const wrapper = mount(
        <SuperControl.View
          name='test'
          className='test'
          component='noscript'/>
      )
      expect(wrapper).to.have.className('test')
    })

  })

})
