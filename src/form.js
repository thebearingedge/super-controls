import { Component, createElement } from 'react'
import { func, object } from 'prop-types'
import modelField from './model-field'
import modelFieldSet from './model-field-set'
import modelFieldArray from './model-field-array'
import { id, add, get, set, omit, noop, invoke, mapProperties } from './util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      init: mapProperties(this.props.values, id),
      values: mapProperties(this.props.values, id),
      fields: {},
      touched: {}
    }
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.registerField = this.registerField.bind(this)
    this.registerFieldSet = this.registerFieldSet.bind(this)
    this.registerFieldArray = this.registerFieldArray.bind(this)
  }
  getChildContext() {
    const { registerField, registerFieldSet, registerFieldArray } = this
    return { registerField, registerFieldSet, registerFieldArray }
  }
  onReset(event) {
    event.preventDefault()
    this.init = mapProperties(this.props.values, id)
    this.setState({
      values: mapProperties(this.props.values, id),
      touched: {}
    })
  }
  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(mapProperties(this.state.values, id))
  }
  update(path, state) {
    this.setState(({ init, fields, values, touched }) => {
      const nextState = { init, fields, values, touched }
      if ('init' in state) {
        nextState.init = set(init, path, state.init)
      }
      if ('value' in state) {
        nextState.values = set(values, path, state.value)
      }
      if ('isTouched' in state) {
        nextState.touched = add(touched, path, state.isTouched)
      }
      if ('registered' in state) {
        nextState.fields = set(fields, path, state.registered)
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
  getField(path, fallback) {
    return get(this.state.fields, path, fallback)
  }
  getTouched(path) {
    return get(this.state.touched, path)
  }
  registerField({ paths, value }) {
    const path = paths.map(invoke)
    const init = this.getInit(path, value)
    const field = modelField(this, init, paths)
    this.update(path, {
      init,
      value: this.getValue(path, value),
      registered: field
    })
    return field
  }
  registerFieldSet({ paths }) {
    return modelFieldSet(this, paths)
  }
  registerFieldArray({ paths }) {
    return modelFieldArray(this, paths)
  }
  render() {
    const { onReset, onSubmit } = this
    return createElement('form', {
      ...omit(this.props, ['values']),
      onReset,
      onSubmit
    })
  }
}

Form.propTypes = {
  values: object,
  onSubmit: func
}

Form.defaultProps = {
  values: {},
  onSubmit: noop
}

Form.childContextTypes = {
  registerField: func,
  registerFieldSet: func,
  registerFieldArray: func
}
