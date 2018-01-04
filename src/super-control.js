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
      isActive: false
    }
    _.assign(this, {
      form,
      route,
      _state,
      config,
      subscribers: [],
      publish: this.publish.bind(this),
      validate: this.validate.bind(this),
      initialize: this.initialize.bind(this)
    })
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
  get isInvalid() {
    return !!this._state.error
  }
  get isActive() {
    return this._state.isActive
  }
  get isVisited() {
    return !!this._state.visits
  }
  get isTouched() {
    return !!this._state.touches
  }
  getState() {
    return _.pick(this, [
      'name', 'path', 'init', 'value',
      'isVisited', 'isTouched', 'isActive',
      'error', 'notice', 'isInvalid', 'hasNotice'
    ])
  }
  subscribe(subscriber) {
    const index = this.subscribers.push(subscriber) - 1
    subscriber(this.getState())
    return _ => {
      this.subscribers.splice(index, 1)
      !this.subscribers.length && this.form.unregister(this.names, this)
    }
  }
  publish() {
    const state = this.getState()
    this.subscribers.forEach(subscriber => subscriber(state))
    return this
  }
  _setState(next, { silent = false } = {}) {
    this._state = next
    return silent ? this : this.publish()
  }
  _patch(change, options = {}) {
    const { form, config, _state: current } = this
    const next = _.assign({}, current, _.omit(change, ['visits', 'touches']))
    if (change.visits || change.touches) {
      if (change.visits) next.visits += change.visits
      if (change.touches) next.touches += change.touches
      if (options.activate) {
        next.isActive = (next.visits > current.visits) ||
                        (current.isActive && next.touches <= current.touches)
      }
    }
    if (options.notify) {
      next.notice = config.notify(next.value, form.values, this)
    }
    if (options.validate) {
      next.error = config.validate(next.value, form.values, this)
    }
    return this._setState(next, options)
  }
  initialize(init) {
    this.form.isInitialized = false
    this.form._patch(this.names, { init, value: init }, { quiet: true })
    this.form.isInitialized = true
  }
  validate(options) {
    const { form, config, value } = this
    this._patch({ error: config.validate(value, form.values, this) }, options)
    return this
  }
  static create(form, init = null, route = [], config = {}) {
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
  static get propTypes() {
    return {
      init: PropTypes.any,
      render: PropTypes.func,
      notify: PropTypes.func,
      validate: PropTypes.func,
      name: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number
      ]).isRequired,
      children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.func
      ]),
      component: PropTypes.oneOfType([
        PropTypes.string, PropTypes.func
      ])
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
