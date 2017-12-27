import { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import * as _ from './util'

export const Model = class SuperControlModel {
  constructor(root, init, route, config) {
    const state = {
      touches: 0,
      visits: 0,
      init: init,
      value: init,
      error: null,
      notice: null,
      isFocused: false
    }
    _.assign(this, config, {
      root,
      route,
      state,
      subscribers: [],
      touch: this.touch.bind(this)
    })
  }
  get name() {
    return this.route[this.route.length - 1]()
  }
  get names() {
    return this.route.map(_.invoke)
  }
  get path() {
    return _.toPath(this.names)
  }
  subscribe(subscriber) {
    const index = this.subscribers.push(subscriber) - 1
    subscriber(this.state)
    return _ => {
      this.subscribers.splice(index, 1)
      this.subscribers.length || this.root.unregister(this.names)
    }
  }
  publish() {
    this.subscribers.forEach(subscriber => subscriber(this.state))
    return this
  }
  patch(state, { notify = false, validate = false, ...options } = {}) {
    const next = _.assign({}, this.state, state)
    if (state.isTouched) next.touches += 1
    if (state.isVisited) next.visits += 1
    if (notify) {
      next.notice = this.notify(next.value, this.root.values) || null
    }
    if (validate) {
      next.error = this.validate(next.value, this.root.values) || null
    }
    next.isFocused = (next.visits > this.state.visits) ||
                     (this.state.isFocused && next.touches <= this.state.touches)
    return this.setState(_.omit(next, ['isVisited', 'isTouched']), options)
  }
  setState(nextState, { silent = false } = {}) {
    this.state = nextState
    return silent ? this : this.publish()
  }
  touch() {
    this.root.patch(this.names, { isTouched: true })
  }
  static create(root, init = null, route = [], config = {}) {
    return new this(root, init, route, _.defaults({}, config, {
      override: _.id,
      notify: _.toNull,
      validate: _.toNull
    }))
  }
}

export class View extends PureComponent {
  get Model() {
    return Model
  }
  get prop() {
    const { model, state } = this
    const isValid = !state.error
    const isInvalid = !isValid
    const hasError = isInvalid
    const hasNotice = !!state.notice
    return _.assign({}, state, _.pick(model, ['name', 'path']), {
      isValid, isInvalid, hasError, hasNotice
    })
  }
  get init() {
    return this.props.init
  }
  get config() {
    return _.pick(this.props, ['notify', 'validate'])
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      init: this.init,
      Model: this.Model,
      config: this.config,
      route: [_ => this.props.name]
    })
    this.unsubscribe = this.model.subscribe(this.setState.bind(this))
  }
  componentWillUnmount() {
    this.unsubscribe()
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
