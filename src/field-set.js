import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this._state.active = null
    this.reset = this.reset.bind(this)
    this.broadcast = this.broadcast.bind(this)
    this.touchAll = this.touchAll.bind(this)
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
  get allErrors() {
    const errors = { $self: this.error }
    this.eachField(field => _.assign(errors, {
      [field.name]: field.allErrors || field.error
    }))
    return errors
  }
  get allValidations() {
    const validations = { $self: this.validation }
    this.eachField(field => _.assign(validations, {
      [field.name]: field.allValidations || field.validation
    }))
    return validations
  }
  getState() {
    return _.assign(super.getState(), _.pick(this, [
      'values', 'anyVisited', 'anyTouched', 'active'
    ]))
  }
  _register(names, field) {
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first]._register(rest, field))
      : _.set(this.fields, [first], field)
    return this._patchField(names, field._state)
  }
  _getField([ first, ...rest ]) {
    const child = this.fields[first]
    if (!child) return null
    if (rest.length) {
      return child instanceof FieldSetModel
        ? child._getField(rest)
        : null
    }
    return child
  }
  _unregister(names, field, options) {
    const registered = this._getField(names)
    if (registered !== field) return this
    this._patch({
      visits: -registered._state.visits,
      touches: -registered._state.touches,
      value: _.unset(this._state.value, names)
    }, options)
    const [ first, ...rest ] = names
    const { fields } = this
    this.fields = rest.length
      ? _.set(fields, [first], fields[first]._unregister(rest, field, options))
      : _.unset(fields, [first])
    return this
  }
  _patchField(names, patch, options = {}) {
    if (!names.length) return this._patch(patch, options)
    const current = this._state
    const next = _.omit(patch, ['init', 'value'])
    if ('init' in patch && !this.form.isInitialized) {
      next.init = _.set(current.init, names, patch.init)
    }
    if ('value' in patch) {
      next.value = _.set(current.value, names, patch.value)
    }
    if ('visits' in patch && patch.visits > 0 && options.activate) {
      next.active = this._getField(names)
    }
    if ('touches' in patch && patch.touches > 0 && options.activate) {
      next.active = null
    }
    this._patch(next, { ...options, silent: options.quiet })
    const [ first, ...rest ] = names
    const child = this.fields[first]
    child instanceof FieldSetModel
      ? child._patchField(rest, patch, options)
      : child._patch(patch, options)
    return this
  }
  initialize(init, options) {
    _.keys(init).forEach(name => {
      this.fields[name] &&
      this.fields[name].initialize(init[name], options)
    })
    return super.initialize(init, options)
  }
  broadcast() {
    this.publish()
    this.eachField(field => _.invoke(field.broadcast || field.publish))
    return this
  }
  changeField(path, value) {
    const field = this._getField(_.toNames(path))
    field && field.change(value)
    return this
  }
  touchField(path) {
    const field = this._getField(_.toNames(path))
    field && field.touch()
    return this
  }
  untouchField(path) {
    const field = this._getField(_.toNames(path))
    field && field.untouch()
    return this
  }
  touchAll() {
    this.eachField(field => _.invoke(field.touchAll || field.touch))
    return this
  }
  untouchAll() {
    this.eachField(field => _.invoke(field.untouchAll || field.untouch))
    return this
  }
  validateAll() {
    this.eachField(field => _.invoke(field.validateAll || field.validate))
    this.validate()
    return this
  }
  reset() {
    const { form, fields, init } = this
    _.keys(fields).reverse().forEach(name => {
      _.exists(init, name)
        ? fields[name].reset()
        : form._unregister(fields[name].names, fields[name])
    })
    return super.reset()
  }
  toJSON() {
    if (this.config.serialize) return this.config.serialize(this)
    const json = {}
    this.eachField(field => _.assign(json, { [field.name]: field.toJSON() }))
    return json
  }
  eachField(procedure) {
    _.keys(this.fields).forEach(name => procedure(this.fields[name]))
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
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: {},
      component: 'fieldset'
    }
  }
}
