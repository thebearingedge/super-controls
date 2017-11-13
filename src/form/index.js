import React, { Component } from 'react'
import { func } from 'prop-types'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = { values: this.props.values, fields: {} }
    this.setValue = this.setValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.registerField = this.registerField.bind(this)
    this.queryField = this.queryField.bind(this)
  }
  getChildContext() {
    const { registerField, queryField, setValue } = this
    return { registerField, queryField, setValue }
  }
  registerField({ name, value, ...field }, setControlState) {
    const fieldValue = name in this.state.values
      ? this.state.values[name]
      : value
    this.setState(({ fields, values }) => ({
      fields: {
        ...fields,
        [name]: { ...field }
      },
      values: {
        ...values,
        [name]: fieldValue
      }
    }))
    return { value: fieldValue }
  }
  queryField(name) {
    return {
      value: this.state.values[name]
    }
  }
  setValue(value, callback) {
    this.setState(({ values }) => ({
      values: {
        ...values,
        ...value
      }
    }), callback)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.state.values)
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        { this.props.children }
      </form>
    )
  }
}

Form.childContextTypes = {
  setValue: func,
  queryField: func,
  registerField: func
}

Form.defaultProps = {
  values: {}
}
