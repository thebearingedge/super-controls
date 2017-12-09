import { Component, createElement } from 'react'
import { func, object, string, shape } from 'prop-types'
import * as _ from './util'

export class Form extends Component {
  constructor(...args) {
    super(...args)
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
      init: this.props.values,
      values: this.props.values
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
    this.setState(({ init, values, touched }) => {
      const nextState = { init, values, touched }
      if ('init' in state) {
        nextState.init = _.set(init, path, state.init)
      }
      if ('value' in state) {
        nextState.values = _.set(values, path, state.value)
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
  register({ init, model, paths }) {
    const path = paths.map(_.invoke)
    const value = this.getInit(path)
    if (!_.isUndefined(value)) {
      return model(this, value, paths)
    }
    this.update(path, { init, value: init })
    return model(this, init, paths)
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
      ..._.omit(this.props, ['values']),
      onReset: this.onReset,
      onSubmit: this.onSubmit
    })
  }
  static get propTypes() {
    return {
      name: string,
      values: object,
      onSubmit: func
    }
  }
  static get defaultProps() {
    return {
      values: {},
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
