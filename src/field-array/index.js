import { Component } from 'react'
import { func, array, string } from 'prop-types'
import { shallowEqual } from '../util'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.field = this.context.registerField({
      name: this.props.name,
      value: this.props.value
    })
    this.state = { ...this.field.state }
    this.model = this.modelArray(this)
    this.update = this.update.bind(this)
    this.registerField = this.registerField.bind(this)
  }
  componentDidUpdate() {
    this.setState(this.field.state)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.field.state, nextState) ||
           !shallowEqual(this.props, nextProps)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  modelArray(fieldArray) {
    return {
      map(transform) {
        return fieldArray.field.state.value.map((value, i) =>
          transform(value, String(i))
        )
      }
    }
  }
  update(index, name, state) {
    const { value, isTouched } = this.field.state
    const updates = { value, isTouched }
    switch (true) {
      case 'value' in state:
        updates.value = [
          ...value.slice(0, index),
          { ...value[index], [name]: state.value },
          ...value.slice(index + 1)
        ]
      case 'isTouched' in state:
        updates.isTouched = isTouched || !!state.isTouched
    }
    this.field.update(updates)
  }
  registerField({ name: path, value }) {
    const index = +path.match(/\d+/)[0]
    const name = path.replace(/\d+\./, '')
    return this.modelField(this, index, name, value)
  }
  modelField(fieldArray, index, name, value) {
    return {
      state: {
        get init() {
          return value
        },
        get value() {
          return fieldArray.field.state.value[index][name]
        },
        get isTouched() {
          return fieldArray.field.state.isTouched
        },
        get isDirty() {
          return this.value !== this.init
        }
      },
      update(state) {
        fieldArray.update(index, name, state)
      }
    }
  }
  render() {
    return this.props.children(this.model)
  }
}

FieldArray.propTypes = {
  name: string.isRequired,
  children: func,
  value: array
}

FieldArray.defaultProps = {
  value: [],
  children: () => null
}

FieldArray.contextTypes = {
  registerField: func.isRequired
}

FieldArray.childContextTypes = {
  registerField: func
}
