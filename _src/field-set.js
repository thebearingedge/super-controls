import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
    this.touchAll = this.touchAll.bind(this)
    this.untouchAll = this.untouchAll.bind(this)
    this.broadcast = this.broadcast.bind(this)
  }
  getState() {
    const { isVisited, isTouched, value, ...state } = super.getState()
    return {
      anyVisited: isVisited, anyTouched: isTouched, values: value, ...state
    }
  }
  register(names, field) {
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].register(rest, field))
      : _.set(this.fields, [first], field)
    return this.patch(names, field.state)
  }
  getField([ first, ...names ]) {
    const child = this.fields[first]
    if (!child) return null
    if (names.length) {
      return child instanceof FieldSetModel
        ? child.getField(names)
        : null
    }
    return child
  }
  unregister(names, field) {
    const registered = this.getField(names)
    if (registered !== field) return this
    super.patch({
      visits: -registered.state.visits,
      touches: -registered.state.touches,
      init: _.unset(this.state.init, names),
      value: _.unset(this.state.value, names)
    })
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].unregister(rest, field))
      : _.unset(this.fields, [first])
    return this
  }
  patch(names, change, options = {}) {
    if (!names.length) return super.patch(change, options)
    const current = this.state
    const next = _.assign({}, change)
    if ('init' in change) {
      next.init = _.set(current.init, names, change.init)
    }
    if ('value' in change) {
      next.value = _.set(current.value, names, change.value)
    }
    super.patch(next, { ...options, silent: !!options.quiet })
    const [ first, ...rest ] = names
    const field = this.fields[first]
    field instanceof FieldSetModel
      ? field.patch(rest, change, options)
      : field.patch(change, options)
    return this
  }
  broadcast() {
    this.publish()
    _.keys(this.fields).forEach(name => {
      _.invoke(this.fields[name].broadcast || this.fields[name].publish)
    })
    return this
  }
  change(path, value) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.change(value)
  }
  touch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.touch()
  }
  untouch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.untouch()
  }
  touchAll() {
    _.keys(this.fields).forEach(key => {
      _.invoke(this.fields[key].touchAll || this.fields[key].touch)
    })
  }
  untouchAll() {
    _.keys(this.fields).forEach(key => {
      _.invoke(this.fields[key].untouchAll || this.fields[key].untouch)
    })
  }
  static create(root, init = {}, route, checks) {
    return super.create(root, init, route, checks)
  }
}

export class View extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.register = this.register.bind(this)
  }
  get Model() {
    return Model
  }
  get prop() {
    return _.assign(super.prop, _.pick(this.model, [
      'change', 'touch', 'touchAll', 'untouch', 'untouchAll'
    ]))
  }
  register({ route, ...params }) {
    return this.context['@@super-controls'].register({
      ...params,
      route: [_ => this.props.name, ...route]
    })
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } }
  }
  equalState(current, next) {
    const { init: stateInit, values: stateValues, ...restState } = current
    const { init: nextInit, values: nextValues, ...restNext } = next
    return _.shallowEqual(restState, restNext) &&
           _.shallowEqual(stateValues, nextValues) &&
           _.shallowEqual(stateInit, nextInit)
  }
  componentWillReceiveProps(next) {
    next.name !== this.props.name &&
    setTimeout(() => this.model.broadcast())
  }
  render() {
    if (_.isFunction(this.props.render) ||
        _.isFunction(this.props.component) ||
        _.isFunction(this.props.children)) {
      return super.render({ fields: this.prop })
    }
    return super.render()
  }
  static get displayName() {
    return 'FieldSet'
  }
  static get childContextTypes() {
    return this.contextTypes
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: PropTypes.object.isRequired,
      children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.func, PropTypes.element
      ])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: {},
      component: 'fieldset'
    }
  }
}
