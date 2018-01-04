import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this._state.active = null
    this.reset = this.reset.bind(this)
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
    this.touchAll = this.touchAll.bind(this)
    this.broadcast = this.broadcast.bind(this)
    this.untouchAll = this.untouchAll.bind(this)
    this.validateAll = this.validateAll.bind(this)
  }
  get values() {
    return this.value
  }
  get anyVisited() {
    return this.isVisited
  }
  get anyTouched() {
    return this.isTouched
  }
  get active() {
    return this._state.active
  }
  get errors() {
    const { fields, error } = this
    return _.keys(fields)
      .reduce((errors, key) => _.assign(
        errors,
        { [key]: fields[key].errors || fields[key].error }
      ), { $self: error })
  }
  getState() {
    return _.assign(super.getState(), _.pick(this, [
      'values', 'anyVisited', 'anyTouched', 'active'
    ]))
  }
  register(names, field) {
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].register(rest, field))
      : _.set(this.fields, [first], field)
    return this._patch(names, field._state)
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
    super._patch({
      visits: -registered._state.visits,
      touches: -registered._state.touches,
      value: _.unset(this._state.value, names)
    })
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].unregister(rest, field))
      : _.unset(this.fields, [first])
    return this
  }
  _patch(names, change, options = {}) {
    if (!names.length) return super._patch(change, options)
    const current = this._state
    const next = _.omit(change, ['init', 'value'])
    if ('init' in change && !this.form.isInitialized) {
      next.init = _.set(current.init, names, change.init)
    }
    if ('value' in change) {
      next.value = _.set(current.value, names, change.value)
    }
    if ('visits' in change && change.visits > 0 && options.activate) {
      next.active = this.getField(names)
    }
    if ('touches' in change && change.touches > 0 && options.activate) {
      next.active = null
    }
    super._patch(next, { ...options, silent: !!options.quiet })
    const [ first, ...rest ] = names
    const field = this.fields[first]
    field instanceof FieldSetModel
      ? field._patch(rest, change, options)
      : field._patch(change, options)
    return this
  }
  initialize(init) {
    _.keys(init).forEach(key => {
      this.fields[key] &&
      this.fields[key].initialize(init[key])
    })
    super.initialize(init)
  }
  broadcast() {
    this.publish()
    this.eachField(field => _.invoke(field.broadcast || field.publish))
    return this
  }
  change(path, value) {
    const field = this.getField(_.toNames(path))
    field && field.change(value)
  }
  touch(path) {
    const field = this.getField(_.toNames(path))
    field && field.touch()
  }
  untouch(path) {
    const field = this.getField(_.toNames(path))
    field && field.untouch()
  }
  touchAll() {
    super._patch({ touches: 1 })
    this.eachField(field => _.invoke(field.touchAll || field.touch))
  }
  untouchAll() {
    this.eachField(field => _.invoke(field.untouchAll || field.untouch))
  }
  validate(options) {
    const { form, config, value } = this
    super._patch({ error: config.validate(value, form.values, this) }, options)
  }
  validateAll() {
    this.validate()
    this.eachField(field => _.invoke(field.validateAll || field.validate))
    return this
  }
  reset() {
    const { form, names, fields, init } = this
    _.keys(fields).reverse().forEach(key => {
      _.exists(init, key)
        ? fields[key].reset()
        : form.unregister(fields[key].names, fields[key])
    })
    form._patch(names, { value: init, error: null, notice: null })
  }
  eachField(procedure) {
    _.keys(this.fields).forEach(key => procedure(this.fields[key]))
  }
  static create(form, init = {}, route, config) {
    return super.create(form, init, route, config)
  }
}

export const View = class FieldSetView extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.register = this.register.bind(this)
  }
  get Model() {
    return Model
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
  render(props) {
    if (_.isFunction(this.props.render) ||
        _.isFunction(this.props.children) ||
        _.isFunction(this.props.component)) {
      return super.render(props || { fields: this.model })
    }
    return super.render(props || {})
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
