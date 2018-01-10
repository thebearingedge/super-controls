import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import * as _ from './util'

export const Model = class SuperControlModel {
  constructor(form, init, route, config) {
    const _state = {
      visits: 0,
      touches: 0,
      init: init,
      value: init,
      error: null,
      notice: null,
      isActive: false,
      validation: null,
      isValidated: false,
      isAsyncValidated: false
    }
    _.assign(this, {
      form,
      config,
      _state,
      _route: route,
      _subscribers: [],
      reset: this.reset.bind(this),
      publish: this.publish.bind(this),
      validate: this.validate.bind(this)
    })
  }
  get name() {
    return (this._route.length || null) &&
           this._route[this._route.length - 1]()
  }
  get names() {
    return this._route.map(_.invoke)
  }
  get path() {
    return _.toPath(this.names)
  }
  get init() {
    return this._state.init
  }
  get value() {
    return this._state.value
  }
  get error() {
    return this._state.error || null
  }
  get notice() {
    return this._state.notice || null
  }
  get hasNotice() {
    return !!this._state.notice
  }
  get isActive() {
    return this._state.isActive
  }
  get isInactive() {
    return !this.isActive
  }
  get isVisited() {
    return !!this._state.visits
  }
  get isTouched() {
    return !!this._state.touches
  }
  get validation() {
    return this._state.validation
  }
  get isValidated() {
    return this._state.isValidated
  }
  get isValidating() {
    return !!this.validation
  }
  get isAsyncValidated() {
    return this._state.isAsyncValidated
  }
  get isValid() {
    return this.isValidated && !this.error
  }
  get isInvalid() {
    return this.isValidated && !!this.error
  }
  get subscribers() {
    return this._subscribers.length
  }
  getState() {
    return _.pick(this, [
      'name', 'path', 'init', 'value',
      'error', 'notice', 'isValid', 'isInvalid',
      'isValidated', 'isValidating', 'isAsyncValidated', 'hasNotice',
      'isActive', 'isInactive', 'isVisited', 'isTouched'
    ])
  }
  subscribe(subscriber) {
    const index = this._subscribers.push(subscriber) - 1
    subscriber(this.getState())
    return _ => {
      this._subscribers.splice(index, 1)
      this.subscribers || this.form._unregister(this.names, this)
    }
  }
  publish() {
    const state = this.getState()
    this._subscribers.forEach(subscriber => subscriber(state))
    return this
  }
  _setState(next, { silent = false } = {}) {
    this._state = next
    return silent ? this : this.publish()
  }
  _patch(patch, options = {}) {
    const { _state: current } = this
    let next = _.assign({}, current, _.omit(patch, ['visits', 'touches']))
    if (patch.visits || patch.touches) {
      if (patch.visits) next.visits += patch.visits
      if (patch.touches) next.touches += patch.touches
      if (options.activate) {
        next.isActive = (next.visits > current.visits) ||
                        (current.isActive && next.touches <= current.touches)
      }
    }
    if (options.validate) next = this._validate(next)
    return this._setState(next, options)
  }
  initialize(init, options = {}) {
    const { form, names } = this
    form.isInitialized = false
    form._patchField(names, { init, value: init }, { quiet: true, ...options })
    form.isInitialized = true
    return this
  }
  validate(options) {
    const next = this._validate({ ...this._state })
    return this._setState(next, options)
  }
  _validate(state) {
    const { config, form } = this
    const validation = config.validate(state.value, form.values, this, form)
    if (_.isPromise(validation)) {
      _.assign(state, {
        error: null,
        notice: null,
        validation,
        isValidated: false,
        isAsyncValidated: false
      })
      validation.then(messages => {
        if (this.validation !== validation) return
        this._patch(_.assign({
          error: null, notice: null
        }, messages, {
          validation: null, isValidated: true, isAsyncValidated: true
        }))
      })
    }
    else {
      _.assign(state, {
        error: null, notice: null
      }, validation, {
        validation: null, isValidated: true, isAsyncValidated: false
      })
    }
    return state
  }
  reset(options) {
    const { form, names, _state: { init, visits, touches } } = this
    const patch = {
      value: init,
      visits: -visits,
      touches: -touches,
      error: null,
      notice: null,
      validation: null,
      isValidated: false,
      isAsyncValidated: false
    }
    form._patchField(names, patch, options)
    return this
  }
  static create(form, init = null, route = [], config = {}) {
    route = _.isString(route) ? _.toRoute(route) : route
    return new this(form, init, route, _.defaults({}, config, {
      override: _.id,
      notify: _.toNull,
      validate: _.toNull
    }))
  }
}

export const View = class SuperControlView extends Component {
  get init() {
    return this.props.init
  }
  get Model() {
    return Model
  }
  get config() {
    return _.pick(this.props, ['notify', 'validate'])
  }
  equalProps(current, next) {
    const ignored = ['name', 'init']
    _.isFunction(current.children) &&
       _.isFunction(next.children) &&
          ignored.push('children')
    return _.shallowEqual(_.omit(current, ignored), _.omit(next, ignored))
  }
  equalState(current, next) {
    return _.shallowEqual(current, next)
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      route: [_ => this.props.name],
      ..._.pick(this, ['init', 'Model', 'config'])
    })
    this.unsubscribe = this.model.subscribe(this.setState.bind(this))
  }
  componentWillReceiveProps(next) {
    next.name !== this.props.name &&
    setTimeout(() => this.model.publish())
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !this.equalProps(this.props, nextProps) ||
           !this.equalState(this.state, nextState)
  }
  componentWillUnmount() {
    this.unsubscribe = this.unsubscribe()
  }
  render(props = {}) {
    const { render, component, children } = this.props
    if (_.isFunction(render)) {
      return render({
        ..._.omit(this.props, ['render']),
        ...props
      })
    }
    if (_.isFunction(children)) {
      return children({
        ..._.omit(this.props, ['children']),
        ...props
      })
    }
    if (_.isString(component)) {
      return createElement(component, {
        ..._.omit(this.props, [
          'init', 'render', 'component',
          'parse', 'format', 'override',
          'notify', 'validate'
        ]),
        ...props
      })
    }
    return createElement(component, {
      ..._.omit(this.props, ['component']),
      ...props
    })
  }
  static get displayName() {
    return 'SuperControl'
  }
  static get contextTypes() {
    return {
      '@@super-controls': PropTypes.shape({
        register: PropTypes.func.isRequired
      })
    }
  }
  static get defaultProps() {
    return {
      init: null,
      notify: _.noop,
      validate: _.noop,
      component: _.toNull
    }
  }
}
