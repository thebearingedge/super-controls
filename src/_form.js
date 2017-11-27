import { Component, createElement } from 'react'
import { object } from 'prop-types'
import modelField from './model-field'
import modelFieldSet from './model-field-set'
import modelFieldArray from './model-field-array'
import { get, set, isUndefined, mapLeaves, fromThunks, toThunks } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.init = mapLeaves(this.props.values, value => value)
    this.state = {
      values: mapLeaves(this.props.values, value => value),
      touched: mapLeaves(this.init, value => false)
    }
    this.fields = mapLeaves(this.init, (_, path) =>
      modelField(this, toThunks(path))
    )
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
  hasInit(path) {
    return !isUndefined(this.getInit(path))
  }
  setInit(path, value) {
    this.init = set(this.init, path, value)
  }
  getInit(path) {
    return get(this.init, path)
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
  registerField({ paths: thunks, value }) {
    const path = fromThunks(thunks)
    if (!this.hasInit(path)) {
      this.init = set(this.init, path, value)
    }
    const registered = get(this.fields, path)
    if (registered) return registered
    const field = modelField(this, thunks)
    this.setField(path, field)
    this.update(path, { value, isTouched: false })
    return field
  }
  registerFieldSet({ paths: thunks, value }) {
    const path = fromThunks(thunks)
    if (!this.hasInit(path)) {
      this.init = set(this.init, path, value)
    }
    const registered = get(this.fields, path)
    if (registered) return modelFieldSet(this, thunks)
    this.setField(path, mapLeaves(value, (_, keyPath) =>
      modelField(this, toThunks([...path, ...keyPath]))
    ))
    this.update(path, {
      value,
      isTouched: mapLeaves(value, _ => false)
    })
    return modelFieldSet(this, thunks)
  }
  registerFieldArray({ paths: thunks, value }) {
    const path = fromThunks(thunks)
    if (!this.hasInit(path)) {
      this.init = set(this.init, path, value)
    }
    const registered = get(this.fields, path, [])
    if (registered.length) return modelFieldArray(this, thunks)
    this.setField(path, value.map((values, i) =>
      mapLeaves(values, (_, keyPath) =>
        modelField(this, toThunks([...path, i, ...keyPath]))
      )
    ))
    this.update(path, {
      value,
      isTouched: mapLeaves(value, _ => false)
    })
    return modelFieldArray(this, thunks)
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
