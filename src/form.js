import { Component } from 'react'
import { func } from 'prop-types'

function modelField(form, name, value) {
  return {
    state: {
      get value() {
        return form.state.values[name] === void 0
          ? value
          : form.state.values[name]
      }
    },
    setValue(value) {
      form.setValue(name, value)
    }
  }
}

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: this.props.values
    }
    this.fields = {}
    this.setValue = this.setValue.bind(this)
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  setValue(name, value) {
    this.setState(({ values }) => ({
      values: {
        ...values,
        [name]: value
      }
    }))
  }
  registerField({ name, value }) {
    const { state, fields, setValue } = this
    fields[name] = modelField(this, name, value)
    if (state.values[name] === void 0) {
      setValue(name, fields[name].state.value)
    }
    return fields[name]
  }
  render() {
    return this.props.children
  }
}

Form.childContextTypes = {
  registerField: func
}

Form.defaultProps = {
  values: {},
  children: []
}
