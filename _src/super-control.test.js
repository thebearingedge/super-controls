import { describe, beforeEach, it } from 'mocha'
import { expect, stub, spy, toRoute } from './__test__'
import { Model } from './super-control'

describe('SuperControl.Model', () => {

  let form

  beforeEach(() => {
    form = { values: { foo: 'bar' }, unregister: stub() }
  })

  describe('state', () => {

    it('returns the state of the model', () => {
      const model = Model.create(form)
      expect(model.state).to.deep.equal({
        error: null,
        notice: null,
        init: void 0,
        value: void 0
      })
    })

  })

  describe('name', () => {

    it('is the last item in the model\'s paths', () => {
      const model = Model.create(form, null, toRoute('foo[0]'))
      expect(model.name).to.equal(0)
    })

  })

  describe('path', () => {

    it('is a string notation of the model\'s paths', () => {
      const model = Model.create(form, null, toRoute('foo[0].bar'))
      expect(model.path).to.equal('foo[0].bar')
    })

  })

  describe('prop', () => {

    it('includes the model\'s current state', () => {
      expect(Model.create().prop).to.deep.include({
        name: null,
        error: null,
        notice: null,
        init: void 0,
        value: void 0
      })
    })

    describe('isPristine', () => {

      it('true if the model\'s value deeply equals its initial value', () => {
        const model = Model.create()
        expect(model.prop).to.include({ isPristine: true })
        model.state.value = 'foo'
        expect(model.prop).to.include({ isPristine: false })
      })

    })

    describe('isDirty', () => {

      it('the opposite of isPristine', () => {
        const model = Model.create()
        model.state.init = model.state.value = 'foo'
        expect(model.prop).to.include({
          isPristine: true,
          isDirty: false
        })
        model.state.value = 'bar'
        expect(model.prop).to.include({
          isPristine: false,
          isDirty: true
        })
      })

    })

    describe('isInvalid', () => {

      it('true if the model\'s error state is truthy', () => {
        const model = Model.create()
        expect(model.prop).to.include({ isInvalid: false })
        model.state.error = 'Oops!'
        expect(model.prop).to.include({ isInvalid: true })
      })

    })

    describe('hasError', () => {

      it('an alias for isInvalid', () => {
        const model = Model.create()
        expect(model.prop).to.include({ hasError: false })
        model.state.error = 'Oops!'
        expect(model.prop).to.include({ hasError: true })
      })

    })

    describe('isValid', () => {

      it('the opposite of isInvalid', () => {
        const model = Model.create()
        expect(model.prop).to.include({
          isValid: true,
          isInvalid: false
        })
        model.state.error = 'Oops!'
        expect(model.prop).to.include({
          isValid: false,
          isInvalid: true
        })
      })

    })

    describe('hasNotice', () => {

      it('is true if the model\'s notice state is truthy', () => {
        const model = Model.create()
        expect(model.prop).to.include({ hasNotice: false })
        model.state.notice = 'Hey!'
        expect(model.prop).to.include({ hasNotice: true })
      })

    })

  })

  describe('setState', () => {

    it('updates the model state', () => {
      const { state } = Model.create(form).setState({ value: 'bar' })
      expect(state).to.deep.equal({
        value: 'bar',
        error: null,
        notice: null
      })
    })

    it('validates a new value', () => {
      const model = Model.create(form, null, void 0, {
        validate: (value, allValues) => value === allValues.foo && 'dupe!'
      })
      const { state } = model.setState({ value: 'bar' })
      expect(state).to.deep.equal({
        value: 'bar',
        notice: null,
        error: 'dupe!'
      })
    })

    it('bypasses validating the new value', () => {
      const model = Model.create(form, null, void 0, {
        validate: (value, allValues) => value === allValues.foo && 'dupe!'
      })
      const { state } = model.setState({ value: 'bar' }, { validate: false })
      expect(state).to.deep.equal({
        value: 'bar',
        notice: null
      })
    })

    it('notifies the new value', () => {
      const model = Model.create(form, null, void 0, {
        notify: (value, allValues) => value === allValues.foo && 'match!'
      })
      const { state } = model.setState({ value: 'bar' })
      expect(state).to.deep.equal({
        value: 'bar',
        error: null,
        notice: 'match!'
      })
    })

    it('bypasses notifying the new value', () => {
      const model = Model.create(form, null, void 0, {
        notify: (value, all) => value === all.foo && 'match!'
      })
      const { state } = model.setState({ value: 'bar' }, { notify: false })
      expect(state).to.deep.equal({
        value: 'bar',
        error: null
      })
    })

  })

  describe('subscribe', () => {

    it('subscribes listeners to state updates', done => {
      const model = Model.create(form)
      model.subscribe(stub().onCall(1).callsFake(state => {
        expect(state).to.deep.equal({
          error: null,
          notice: null,
          value: 'foo'
        })
        done()
      }))
      model.setState({ value: 'foo' })
    })

    it('returns an unsubscribe function', () => {
      const model = Model.create(form)
      const subscriber = spy()
      const unsubscribe = model.subscribe(subscriber)
      model.subscribe(_ => {})
      unsubscribe()
      model.setState({ value: 'foo' })
      expect(subscriber).to.have.callCount(1)
    })

    it('unregisters the model when the last subscriber unsubscribes', () => {
      const model = Model.create(form, void 0, [_ => 'foo'])
      const unsubscribe = model.subscribe(_ => {})
      unsubscribe()
      expect(form.unregister).to.have.been.calledWith(['foo'])
    })

  })

})
