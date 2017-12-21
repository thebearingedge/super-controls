import * as _ from './util'

export class Model {
  constructor(form, init, route = [], { notify, validate, override } = {}) {
    this.state = {
      init: init,
      value: init,
      error: null,
      notice: null
    }
    this.form = form
    this.route = route
    this.subscribers = []
    this.notify = notify || _.noop
    this.override = override || _.id
    this.validate = validate || _.noop
  }
  get name() {
    return (this.route.length || null) &&
           this.route[this.route.length - 1]()
  }
  get names() {
    return this.route.map(_.invoke)
  }
  get path() {
    return _.toPath(this.names)
  }
  get prop() {
    const isPristine = _.deepEqual(this.state.value, this.state.init)
    const isDirty = !isPristine
    const isValid = !this.state.error
    const isInvalid = !isValid
    const hasError = isInvalid
    const hasNotice = !!this.state.notice
    return _.assign({}, this.state, _.pick(this, ['name', 'path']), {
      isPristine, isDirty, isValid, isInvalid, hasError, hasNotice
    })
  }
  subscribe(subscriber) {
    const index = this.subscribers.push(subscriber)
    subscriber(this.state)
    return _ => {
      this.subscribers.splice(index - 1)
      this.subscribers.length || this.form.unregister(this.names)
    }
  }
  publish() {
    this.subscribers.forEach(subscriber => subscriber(this.state))
    return this
  }
  setState(nextState, { notify = true, validate = true } = {}) {
    const { value } = nextState
    const { values } = this.form
    if (notify) nextState.notice = this.notify(value, values) || null
    if (validate) nextState.error = this.validate(value, values) || null
    this.state = nextState
    return this.publish()
  }
  static get create() {
    return (...args) => new this(...args)
  }
}
