import { Component, createElement } from 'react'
import { func, object, string, shape } from 'prop-types'
import * as _ from './util'

export class Form extends Component {
  constructor(...args) {
    super(...args)
    this.fieldId = 0
    this.root = new Fields(this.fieldId, {
      validate: this.props.validate
    })
    this.state = this.getInitialState()
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.register = this.register.bind(this)
  }
  getInitialState() {
    return {
      errors: {},
      notices: {},
      touched: {},
      visited: {},
      focused: null,
      submitFailed: false,
      init: this.props.init,
      values: this.props.init
    }
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } }
  }
  onReset(event) {
    event.preventDefault()
    this.setState(this.getInitialState())
  }
  onSubmit(event) {
    event.preventDefault()
    const { values } = this.state
    const errors = this.root.checkAll(values, values, 'validate')
    const hasErrors = _.keys(errors).some(key => errors[key])
    if (hasErrors) return this.setState({ errors, submitFailed: true })
    this.props.onSubmit(_.clone(values))
  }
  get fields() {
    return this.root.fields
  }
  get values() {
    return this.state.values
  }
  get submitFailed() {
    return this.state.submitFailed
  }
  update(path, state, options = {}) {
    const { check } = this.root
    this.setState(({
      init, values, focused, visited, errors, notices, touched
    }) => {
      const nextState = {
        init, values, focused, visited, errors, notices, touched
      }
      if ('init' in state) {
        nextState.init = _.set(init, path, state.init)
      }
      if ('value' in state) {
        nextState.values = _.set(values, path, state.value)
        if (options.validate) {
          nextState.errors = _.assign(
            errors,
            check(state.value, values, 'validate', path)
          )
        }
        if (options.notify) {
          nextState.notices = _.assign(
            notices,
            check(state.value, values, 'notify', path)
          )
        }
      }
      if ('isTouched' in state) {
        nextState.touched = _.set(touched, path, state.isTouched)
      }
      if ('isFocused' in state) {
        nextState.focused = state.isFocused
        nextState.visited = _.set(visited, path, true)
      }
      if ('unregistered' in state) {
        nextState.touched = _.unset(touched, path)
        nextState.values = _.unset(values, path)
        nextState.init = _.unset(init, path)
      }
      return nextState
    })
  }
  getInit(path, fallback) {
    return _.get(this.state.init, path, fallback)
  }
  getValue(path, fallback) {
    return _.get(this.state.values, path, fallback)
  }
  getTouched(path, fallback) {
    return _.get(this.state.touched, path, fallback)
  }
  getFocused() {
    return this.state.focused
  }
  getVisited(path, fallback) {
    return _.get(this.state.visited, path, fallback)
  }
  getError(fieldId) {
    return this.state.errors[fieldId] || null
  }
  getNotice(fieldId) {
    return this.state.notices[fieldId] || null
  }
  register({ init, model, paths }) {
    const path = paths.map(_.invoke)
    const value = this.getInit(path)
    if (_.isUndefined(value)) {
      const field = model(++this.fieldId, this, init, paths)
      this.root.register(field, path)
      this.update(path, { init, value: init })
      return field
    }
    const field = model(++this.fieldId, this, value, paths)
    return this.root.register(field, path)
  }
  unregister({ path }) {
    if (_.isUndefined(this.getValue(path)) &&
        _.isUndefined(this.getInit(path)) &&
        _.isUndefined(this.getTouched(path))) {
      return
    }
    this.update(path, { unregistered: true })
  }
  render() {
    return createElement('form', {
      ..._.omit(this.props, ['init', 'notify', 'validate']),
      onReset: this.onReset,
      onSubmit: this.onSubmit
    })
  }
  static get propTypes() {
    return {
      name: string,
      notify: func,
      validate: func,
      init: object,
      onSubmit: func
    }
  }
  static get defaultProps() {
    return {
      init: {},
      notify: _.noop,
      validate: _.noop,
      onSubmit: _.noop
    }
  }
  static get childContextTypes() {
    return {
      '@@super-controls': shape({
        register: func
      })
    }
  }
}

export class Fields {
  constructor(id, { validate }) {
    this.id = id
    this.fields = {}
    this._validate = validate
    this.check = this.check.bind(this)
  }
  register(field, [ key, ...path ]) {
    const { fields } = this
    this.fields = path.length
      ? _.assign(fields, { [key]: fields[key].register(field, path) })
      : _.assign(fields, { [key]: field })
    return field
  }
  check(value, values, method, [ key, ...path ] = []) {
    if (_.isUndefined(key)) {
      return { [this.id]: this[`_${method}`](value) || null }
    }
    return this.fields[key].check(value, values, method, path)
  }
  checkAll(value, values, method) {
    return _.keys(this.fields)
      .reduce((checked, key) => {
        const { check, checkAll } = this.fields[key]
        return _.assign(
          checked,
          (checkAll || check)(values[key], values, method)
        )
      }, this.check(value, values, method))
  }
}
