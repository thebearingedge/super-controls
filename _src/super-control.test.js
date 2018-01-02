import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, toRoute, mountWith } from './__test__'
import * as Form from './form'
import * as SuperControl from './super-control'

describe('SuperControl.Model', () => {

  describe('name', () => {

    it('is null by default', () => {
      const model = SuperControl.Model.create()
      expect(model.name).to.equal(null)
    })

    it('is the last name in the model\'s route', () => {
      const model = SuperControl.Model.create(null, null, toRoute('foo[0]'))
      expect(model.name).to.equal(0)
    })

  })

  describe('names', () => {

    it('is the list of names in the model\'s hierarchy', () => {
      const named = SuperControl.Model.create(null, null, toRoute('foo[0]'))
      expect(named.names).to.deep.equal(['foo', 0])
      const unnamed = SuperControl.Model.create()
      expect(unnamed.names).to.deep.equal([])
    })

  })

  describe('path', () => {

    it('is a string notation of the model\'s path', () => {
      const named = SuperControl.Model.create(null, null, toRoute('foo[0].bar'))
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
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
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
      expect(model.subscribers).to.have.lengthOf(2)
    })

    it('returns an unsubscribe function', () => {
      const model = SuperControl.Model.create()
      const unsubscribe = model.subscribe(() => {})
      expect(unsubscribe).to.be.a('function')
    })

    it('unregisters when the last subscriber unsubscribes', () => {
      const form = { unregister: stub(), state: {} }
      const model = SuperControl.Model.create(form, null, toRoute('foo'))
      const unsubscribe = model.subscribe(_ => {})
      unsubscribe()
      expect(form.unregister).to.have.been.calledWith(['foo'])
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

  describe('setState', () => {

    it('replaces the state of the model', () => {
      const model = SuperControl.Model.create()
      model.setState({ ...model.state, value: 'foo' })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
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
          isValid: true,
          isInvalid: false,
          hasNotice: false,
          isActive: false,
          isVisited: false,
          isTouched: false
        })
        done()
      }))
      model.setState({ ...model.state, value: 'foo' })
    })

    it('silently replaces the state of the model', () => {
      const model = SuperControl.Model.create()
      model
        .subscribe(stub().onCall(1).throws(new Error('setState not silenced')))
      model.setState({ ...model.state, value: 'foo' }, { silent: true })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'foo',
        error: null,
        notice: null,
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
        isVisited: false,
        isTouched: false
      })
    })

  })

  describe('patch', () => {

    let form

    beforeEach(() => {
      form = { values: { foo: 'foo' } }
    })

    it('patches the value state of the model', () => {
      const model = SuperControl.Model.create()
      model.patch({ value: 'bar' })
      expect(model.getState()).to.deep.equal({
        path: '',
        name: null,
        init: null,
        value: 'bar',
        error: null,
        notice: null,
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
        isVisited: false,
        isTouched: false
      })
    })

    it('validates a new value state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        validate: (value, allValues) => value === allValues.foo && 'dupe!'
      })
      model.patch({ value: 'foo' }, { validate: true })
      expect(model.getState()).to.include({
        value: 'foo',
        notice: null,
        error: 'dupe!',
        isValid: false,
        isInvalid: true,
        hasNotice: false
      })
    })

    it('notifies the new value state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        notify: (value, allValues) => value === allValues.foo && 'match!'
      })
      model.patch({ value: 'foo' }, { notify: true })
      expect(model.getState()).to.include({
        value: 'foo',
        error: null,
        notice: 'match!',
        isValid: true,
        isInvalid: false,
        hasNotice: true
      })
    })

    it('patches the isVisited state of the model', () => {
      const model = SuperControl.Model.create()
      model.patch({ visits: 1 })
      expect(model.getState()).to.include({ isVisited: true })
      model.patch({ visits: -1 })
      expect(model.getState()).to.include({ isVisited: false })
    })

    it('patches the isTouched state of the model', () => {
      const model = SuperControl.Model.create()
      model.patch({ touches: 1 })
      expect(model.getState()).to.include({ isTouched: true })
      model.patch({ touches: -1 })
      expect(model.getState()).to.include({ isTouched: false })
    })

    it('patches the isActive state of the model', () => {
      const model = SuperControl.Model.create()
      model.patch({ visits: 1 })
      expect(model.getState()).to.include({ isActive: true })
      model.patch({ touches: 1 })
      expect(model.getState()).to.include({ isActive: false })
    })

  })

  describe('initialize', () => {

    it('patches the init and value states of the model', () => {
      const model = SuperControl.Model.create()
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

})

describe('SuperControl.View', () => {

  let form
  let mount

  beforeEach(() => {
    form = Form.Model.create('test', {})
    mount = mountWith({ context: { '@@super-controls': form } })
  })

  describe('prop', () => {

    it('includes the view\'s current state', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const view = wrapper.instance()
      expect(view.prop).to.deep.equal(view.state)
    })

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
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
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
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
        isVisited: false,
        isTouched: false
      })
      view.model.patch({ value: 'test' })
      expect(view.state).to.deep.equal({
        name: 'test',
        path: 'test',
        init: null,
        value: 'test',
        error: null,
        notice: null,
        isValid: true,
        isInvalid: false,
        hasNotice: false,
        isActive: false,
        isVisited: false,
        isTouched: false
      })
    })

  })

  describe('componentWillUnmount', () => {

    it('unsubscribes the view from its model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const { model } = wrapper.instance()
      expect(model.subscribers).to.have.lengthOf(1)
      wrapper.unmount()
      expect(model.subscribers).to.have.lengthOf(0)
    })

  })

  describe('componentWillReceiveProps', () => {

    it('defers updates of its name field', done => {
      const foo = form.register({
        init: null,
        route: toRoute('foo'),
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
        expect(model).to.include({ validate })
      })

    })

    describe('notify', () => {

      it('configures its model\'s notify method', () => {
        const notify = _ => {}
        const wrapper = mount(
          <SuperControl.View name='test' notify={notify}/>
        )
        const { model } = wrapper.instance()
        expect(model).to.include({ notify })
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
