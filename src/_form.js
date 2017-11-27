import { Component, createElement } from 'react'
import { object } from 'prop-types'
import modelField from './model-field'
import modelFieldSet from './model-field-set'
import modelFieldArray from './model-field-array'
import { get, set, mapLeaves, toPaths } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: { ...this.props.values },
      touched: mapLeaves(this.props.values, _ => false)
    }
    this.fields = mapLeaves(this.state.values, (value, path) =>
      modelField(this, value, toPaths(path))
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
    const path = paths.map(path => path()).join('.')
    const registered = get(this.fields, path)
    if (registered) return registered
    const init = get(this.state.values, path, value)
    const field = modelField(this, init, paths)
    this.setField(path, field)
    this.update(path, { value, isTouched: false })
    return field
  }
  registerFieldSet({ paths, value }) {
    const path = paths.map(path => path()).join('.')
    const init = get(this.state.values, path, value)
    const registered = get(this.fields, path)
    if (registered) return modelFieldSet(this, init, paths)
    this.setField(path, mapLeaves(value, (init, keyPath) =>
      modelField(this, init, toPaths(`${keyPath}.${path}`))
    ))
    this.update(path, {
      value: init,
      isTouched: mapLeaves(init, _ => false)
    })
    return modelFieldSet(this, init, paths)
  }
  registerFieldArray({ paths, value }) {
    const path = paths.map(path => path()).join('.')
    const init = get(this.state.values, path, value)
    const registered = get(this.fields, path, [])
    if (registered.length) return modelFieldArray(this, init, paths)
    this.setField(path, init.map((values, i) =>
      mapLeaves(values, (init, path) =>
        modelField(this, init, toPaths(`${i}.${path}`))
      )
    ))
    this.update(path, {
      value: init,
      isTouched: init.map(values => mapLeaves(values, _ => false))
    })
    return modelFieldArray(this, init, paths)
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
