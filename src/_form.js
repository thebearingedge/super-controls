import { Component, createElement } from 'react'
import { object } from 'prop-types'
import { get, set, mapLeaves, isObject } from './_util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: { ...this.props.values },
      touched: mapLeaves(this.props.values, _ => false)
    }
    this.update = this.update.bind(this)
    this.modelField = this.modelField.bind(this)
    this.modelArray = this.modelArray.bind(this)
    this.registerField = this.registerField.bind(this)
    this.fields = mapLeaves(this.state.values, this.modelField)
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
    if (registered) {
      if (!Array.isArray(registered)) return registered
      const init = get(this.state.values, path, value)
      return this.modelArray(registered, init, path)
    }
    const init = get(this.state.values, path, value)
    if (!Array.isArray(init) || !isObject(init[0])) {
      const field = this.modelField(init, path)
      this.fields = set(this.fields, path, field)
      this.update(path, { value, isTouched: false })
      return field
    }
    const fieldSets = init.map((values, i) =>
      mapLeaves(values, (init, path) =>
        this.modelField(init, `${i}.${path}`)
      ))
    this.fields = set(this.fields, path, fieldSets)
    this.update(path, {
      value: init,
      isTouched: init.map(values => mapLeaves(values, _ => false))
    })
    return this.modelArray(fieldSets, init, path)
  }
  modelArray(fieldSets, init, path) {
    const form = this
    const field = {
      get init() {
        return init
      },
      get value() {
        return get(form.state.values, path, this.init)
      },
      get isTouched() {
        return fieldSets.some(fieldSet =>
          Object.keys(fieldSet).some(field => field.isTouched)
        )
      },
      get isDirty() {
        return fieldSets.some(fieldSet =>
          Object.keys(fieldSet).some(field => field.isDirty)
        )
      },
      get isPristine() {
        return !this.isDirty
      }
    }
    return field
  }
  modelField(init, path) {
    const form = this
    const field = {
      get init() {
        return init
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
