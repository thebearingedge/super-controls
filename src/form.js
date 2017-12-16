import { Component, createElement } from 'react'
import { func, object, string, shape } from 'prop-types'
import * as _ from './util'

export class Form extends Component {
  constructor(...args) {
    super(...args)
    this.fieldId = 0
    this.fields = new Fields()
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
    this.props.onSubmit(_.clone(this.state.values))
  }
  update(path, state) {
    const { check } = this.fields
    this.setState(({ init, values, errors, notices, touched }) => {
      const nextState = { init, values, errors, notices, touched }
      if ('init' in state) {
        nextState.init = _.set(init, path, state.init)
      }
      if ('value' in state) {
        nextState.values = _.set(values, path, state.value)
        if (state.validate) {
          nextState.errors = _.assign(
            errors,
            check(state.value, values, 'validate', path)
          )
        }
        if (state.notify) {
          nextState.notices = _.assign(
            notices,
            check(state.value, values, 'notify', path)
          )
        }
      }
      if ('isTouched' in state) {
        nextState.touched = _.set(touched, path, state.isTouched)
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
  getError(fieldId) {
    return this.state.errors[fieldId] || null
  }
  getNotice(fieldId) {
    return this.state.notices[fieldId] || null
  }
  register({ init, model, paths }) {
    const path = paths.map(_.invoke)
    const value = this.getInit(path)
    if (!_.isUndefined(value)) {
      const field = model(++this.fieldId, this, value, paths)
      return this.fields.register(field, path)
    }
    const field = model(++this.fieldId, this, init, paths)
    this.fields.register(field, path)
    this.update(path, { init, value: init })
    return field
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
      ..._.omit(this.props, ['values', 'notify', 'validate']),
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
  constructor() {
    this.fields = {}
    this.check = this.check.bind(this)
  }
  register(field, [ key, ...path ]) {
    const { fields } = this
    this.fields = path.length
      ? _.assign(fields, { [key]: fields[key].register(field, path) })
      : _.assign(fields, { [key]: field })
    return field
  }
  check(value, values, method, [ key, ...path ]) {
    return this.fields[key].check(value, values, method, path)
  }
}
