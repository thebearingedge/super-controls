import { Component, createElement } from 'react'
import { object } from 'prop-types'
import { get, set, mapLeaves } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: this.props.values,
      touched: mapLeaves(this.props.values, _ => false)
    }
    this.modelField = this.modelField.bind(this)
    this.fields = mapLeaves(this.props.values, this.modelField)
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
  registerField({ path, value }) {
    const registered = get(this.fields, path)
    if (registered) return registered
    const field = this.modelField(value, path)
    this.fields = set(this.fields, path, field)
    this.update(path, { value, isTouched: false })
    return field
  }
  modelField(value, path) {
    const form = this
    const field = {
      get init() {
        return value
      },
      get value() {
        return get(form.state.values, path, this.init)
      },
      get isTouched() {
        return !!get(form.state.touched, path)
      },
      get isDirty() {
        return this.value !== this.init
      },
      get isPristine() {
        return !this.isDirty
      }
    }
    return Object.defineProperty(field, 'update', {
      enumerable: false,
      value: state => form.update(path, state)
    })
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
