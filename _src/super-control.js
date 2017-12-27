import { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import * as _ from './util'

export const Model = class SuperControlModel {
  constructor(root, init, route, config) {
    const state = {
      visits: 0,
      touches: 0,
      init: init,
      value: init,
      error: null,
      notice: null,
      isActive: false
    }
    _.assign(this, config, {
      root,
      route,
      state,
      subscribers: []
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
  getState() {
    const { visits, touches, ...state } = this.state
    return { ...state, isVisited: !!visits, isTouched: !!touches }
  }
  subscribe(subscriber) {
    const index = this.subscribers.push(subscriber) - 1
    subscriber(this.getState())
    return _ => {
      this.subscribers.splice(index, 1)
      this.subscribers.length || this.root.unregister(this.names)
    }
  }
  publish() {
    const state = this.getState()
    this.subscribers.forEach(subscriber => subscriber(state))
    return this
  }
  patch(state, { notify = false, validate = false, ...options } = {}) {
    const next = _.assign({}, this.state, _.omit(state, ['visits', 'touches']))
    if ('visits' in state) next.visits += state.visits
    if ('touches' in state) next.touches += state.touches
    if (notify) {
      next.notice = this.notify(next.value, this.root.values)
    }
    if (validate) {
      next.error = this.validate(next.value, this.root.values)
    }
    next.isActive = (next.visits > this.state.visits) ||
                     (this.state.isActive && next.touches <= this.state.touches)
    return this.setState(next, options)
  }
  setState(nextState, { silent = false } = {}) {
    this.state = nextState
    return silent ? this : this.publish()
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
  get init() {
    return this.props.init
  }
  get Model() {
    return Model
  }
  get config() {
    return _.pick(this.props, ['notify', 'validate'])
  }
  get prop() {
    const { state: { error, notice } } = this
    const isValid = !error
    const hasError = !isValid
    const isInvalid = hasError
    const hasNotice = !!notice
    return _.assign(_.pick(this.model, [
      'name', 'path'
    ]), _.pick(this.state, [
      'init', 'value', 'isActive'
    ]), {
      error, notice, isValid, hasError, isInvalid, hasNotice
    })
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      route: [_.wrap(this.props.name)],
      ..._.pick(this, ['init', 'Model', 'config'])
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
