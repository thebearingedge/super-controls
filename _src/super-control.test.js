import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { expect, stub, spy, toRoute, mountWith } from './__test__'
import * as Form from './form'
import * as SuperControl from './super-control'

describe('SuperControl.Model', () => {

  describe('state', () => {

    it('is the state of the model', () => {
      const model = SuperControl.Model.create()
      expect(model.state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        value: null,
        error: null,
        notice: null,
        isFocused: false
      })
    })

  })

  describe('name', () => {

    it('is the last item in the model\'s route', () => {
      const model = SuperControl.Model.create(null, null, toRoute('foo[0]'))
      expect(model.name).to.equal(0)
    })

  })

  describe('path', () => {

    it('is a string notation of the model\'s path', () => {
      const model = SuperControl.Model.create(null, null, toRoute('foo[0].bar'))
      expect(model.path).to.equal('foo[0].bar')
    })

  })

  describe('patch', () => {

    let form

    beforeEach(() => {
      form = { values: { foo: 'bar' } }
    })

    it('patches the model\'s state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        validate: (value, allValues) => value === allValues.foo && 'dupe!'
      })
      const { state } = model.patch({ value: 'bar' })
      expect(state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        value: 'bar',
        error: null,
        notice: null,
        isFocused: false
      })
    })

    it('validates a new value state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        validate: (value, allValues) => value === allValues.foo && 'dupe!'
      })
      const { state } = model.patch({ value: 'bar' }, { validate: true })
      expect(state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        value: 'bar',
        notice: null,
        error: 'dupe!',
        isFocused: false
      })
    })

    it('notifies a new value state', () => {
      const model = SuperControl.Model.create(form, null, void 0, {
        notify: (value, all) => value === all.foo && 'match!'
      })
      const { state } = model.patch({ value: 'bar' }, { notify: true })
      expect(state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        value: 'bar',
        error: null,
        notice: 'match!',
        isFocused: false
      })
    })

  })

  describe('setState', () => {

    it('updates the model state', () => {
      const model = SuperControl.Model.create()
      const { state } = model.setState({ value: 'bar' })
      expect(state).to.deep.equal({ value: 'bar' })
    })

  })

  describe('touch', () => {

    let form

    beforeEach(() => {
      form = { patch: stub() }
    })

    it('increments the model\'s blurs state', () => {
      const model = SuperControl.Model.create(form)
      form.patch.callsFake((_, ...args) => model.patch(...args))
      model.touch()
      expect(model.state).to.include({ blurs: 1 })
    })

  })

  describe('subscribe', () => {

    it('subscribes listeners to state updates', done => {
      const model = SuperControl.Model.create()
      model.subscribe(stub().onCall(1).callsFake(state => {
        expect(state).to.deep.equal({ value: 'foo' })
        done()
      }))
      model.setState({ value: 'foo' })
    })

    it('returns an unsubscribe function', () => {
      const model = SuperControl.Model.create()
      const subscriber = spy()
      const unsubscribe = model.subscribe(subscriber)
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
      expect(view.state)
        .to.deep.equal({
          blurs: 0,
          visits: 0,
          init: null,
          value: null,
          error: null,
          notice: null,
          isFocused: false
        })
    })

    it('subscribes to state updates on its model', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const view = wrapper.instance()
      expect(view.state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        value: null,
        error: null,
        notice: null,
        isFocused: false
      })
      view.model.setState({ value: 'test' })
      expect(view.state).to.deep.equal({
        blurs: 0,
        visits: 0,
        init: null,
        error: null,
        notice: null,
        value: 'test',
        isFocused: false
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

  describe('prop', () => {

    it('includes the view\'s name and current state', () => {
      const wrapper = mount(<SuperControl.View name='test'/>)
      const { prop } = wrapper.instance()
      expect(prop).to.include({
        name: 'test',
        path: 'test',
        init: null,
        value: null,
        error: null,
        notice: null,
        isFocused: false
      })
    })

    describe('isInvalid', () => {

      it('is true if the view\'s error state is truthy', () => {
        const wrapper = mount(<SuperControl.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ isInvalid: false })
        view.setState({ error: 'Oops!' })
        expect(view.prop).to.include({ isInvalid: true })
      })

    })

    describe('hasError', () => {

      it('is an alias for isInvalid', () => {
        const wrapper = mount(<SuperControl.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ hasError: false })
        view.setState({ error: 'Oops!' })
        expect(view.prop).to.include({ hasError: true })
      })

    })

    describe('isValid', () => {

      it('is the opposite of isInvalid', () => {
        const wrapper = mount(<SuperControl.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({
          isValid: true,
          isInvalid: false
        })
        view.setState({ error: 'Oops!' })
        expect(view.prop).to.include({
          isValid: false,
          isInvalid: true
        })
      })

    })

    describe('hasNotice', () => {

      it('is true if the model\'s notice state is truthy', () => {
        const wrapper = mount(<SuperControl.View name='test'/>)
        const view = wrapper.instance()
        expect(view.prop).to.include({ hasNotice: false })
        view.setState({ notice: 'Hey!' })
        expect(view.prop).to.include({ hasNotice: true })
      })

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
