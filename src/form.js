import { Component, createElement } from 'react'
import { func, object, string, shape } from 'prop-types'
import {
  KEY,
  get,
  set,
  omit,
  noop,
  unset,
  clone,
  invoke,
  isUndefined
} from './util'

export class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      touched: {},
      init: this.props.values,
      values: this.props.values
    }
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.register = this.register.bind(this)
  }
  getChildContext() {
    const { register } = this
    return { [KEY]: { register } }
  }
  onReset(event) {
    event.preventDefault()
    this.setState({
      touched: {},
      init: this.props.values,
      values: this.props.values
    })
  }
  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(clone(this.state.values))
  }
  update(path, state) {
    this.setState(({ init, values, touched }) => {
      const nextState = { init, values, touched }
      if ('init' in state) {
        nextState.init = set(init, path, state.init)
      }
      if ('value' in state) {
        nextState.values = set(values, path, state.value)
      }
      if ('isTouched' in state) {
        nextState.touched = set(touched, path, state.isTouched)
      }
      if ('unregistered' in state) {
        nextState.touched = unset(touched, path)
        nextState.values = unset(values, path)
        nextState.init = unset(init, path)
      }
      return nextState
    })
  }
  getInit(path, fallback) {
    return get(this.state.init, path, fallback)
  }
  getValue(path, fallback) {
    return get(this.state.values, path, fallback)
  }
  getTouched(path, fallback) {
    return get(this.state.touched, path, fallback)
  }
  register({ paths, model, init }) {
    const path = paths.map(invoke)
    const value = this.getInit(path)
    if (!isUndefined(value)) {
      return model(this, value, paths)
    }
    this.update(path, { init, value: init })
    return model(this, init, paths)
  }
  unregister({ path }) {
    if (isUndefined(this.getValue(path)) &&
        isUndefined(this.getInit(path)) &&
        isUndefined(this.getTouched(path))) {
      return
    }
    this.update(path, { unregistered: true })
  }
  render() {
    const { onReset, onSubmit } = this
    return createElement('form', {
      ...omit(this.props, ['values']),
      onReset,
      onSubmit
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
      onSubmit: noop
    }
  }
  static get childContextTypes() {
    return {
      [KEY]: shape({
        register: func
      })
    }
  }
}
