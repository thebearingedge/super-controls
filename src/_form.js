import { Component, createElement } from 'react'
import { object } from 'prop-types'
import modelField from './model-field'
import modelFieldSet from './model-field-set'
import modelFieldArray from './model-field-array'
import { id, get, set, fromThunks, isUndefined, mapProperties } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.init = mapProperties(this.props.values, id)
    this.state = {
      values: mapProperties(this.props.values, id),
      touched: {}
    }
  }
  update(path, state) {
    this.setState(({ values, touched }) => {
      const nextState = { values, touched }
      if ('value' in state) {
        nextState.values = set(values, path, state.value)
      }
      if ('isTouched' in state) {
        nextState.touched = set(touched, path, state.isTouched)
      }
      return nextState
    })
  }
  setInit(path, value) {
    this.init = set(this.init, path, value)
  }
  getInit(path) {
    return get(this.init, path)
  }
  ensureInit(path, value) {
    if (!isUndefined(this.getInit(path))) return
    this.setInit(path, value)
    this.update(path, { value })
  }
  setField(path, field) {
    this.fields = set(this.fields, path, field)
  }
  getField(path, fallback) {
    return get(this.fields, path, fallback)
  }
  getTouched(path, fallback) {
    return get(this.state.touched, path, fallback)
  }
  getValue(path, fallback) {
    return get(this.state.values, path, fallback)
  }
  registerField({ paths, value }) {
    const path = fromThunks(paths)
    this.ensureInit(path, value)
    if (isUndefined(this.getTouched(path))) {
      this.update(path, { isTouched: false })
    }
    const field = modelField(this, paths)
    this.setField(path, field)
    return field
  }
  registerFieldSet({ paths, value }) {
    const path = fromThunks(paths)
    this.ensureInit(path, value)
    return modelFieldSet(this, paths)
  }
  registerFieldArray({ paths, value }) {
    const path = fromThunks(paths)
    this.ensureInit(path, value)
    return modelFieldArray(this, paths)
  }
  render() {
    return createElement('form')
  }
}

Form.propTypes = {
  values: object
}

Form.defaultProps = {
  values: {}
}
