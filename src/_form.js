import { Component, createElement } from 'react'
import { object } from 'prop-types'
import modelField from './model-field'
import modelFieldSet from './model-field-set'
import ModelFieldArray from './model-field-array'
import { get, set, mapLeaves } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: { ...this.props.values },
      touched: mapLeaves(this.props.values, _ => false)
    }
    this.fields = mapLeaves(this.state.values, (value, path) =>
      modelField(this, value, path)
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
  registerField({ path, value }) {
    const registered = get(this.fields, path)
    if (registered) return registered
    const init = get(this.state.values, path, value)
    const field = modelField(this, init, path)
    this.setField(path, field)
    this.update(path, { value, isTouched: false })
    return field
  }
  registerFieldSet({ path, value }) {
    const init = get(this.state.values, path, value)
    const registered = get(this.fields, path)
    if (registered) return modelFieldSet(this, init, path)
    this.setField(path, mapLeaves(value, (init, keyPath) =>
      modelField(this, init, `${keyPath}.${path}`)
    ))
    this.update(path, {
      value: init,
      isTouched: mapLeaves(init, _ => false)
    })
    return modelFieldSet(this, init, path)
  }
  registerFieldArray({ path, value }) {
    const init = get(this.state.values, path, value)
    const registered = get(this.fields, path, [])
    if (registered.length) return new ModelFieldArray(this, init, path)
    this.setField(path, init.map((values, i) =>
      mapLeaves(values, (init, path) =>
        modelField(this, init, `${i}.${path}`)
      )
    ))
    this.update(path, {
      value: init,
      isTouched: init.map(values => mapLeaves(values, _ => false))
    })
    return new ModelFieldArray(this, init, path)
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
