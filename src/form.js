import { Component } from 'react'
import { func } from 'prop-types'

function modelField(form, name) {
  return {
    state: {
      get value() {
        return form.state.values[name]
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
  registerField({ name }) {
    this.fields[name] = this.fields[name] || modelField(this, name)
    return this.fields[name]
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
