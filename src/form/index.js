import React, { Component } from 'react'
import { func } from 'prop-types'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = { values: this.props.values }
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  getChildContext() {
    const { getValue, setValue } = this
    return { getValue, setValue }
  }
  getValue(name) {
    return this.state.values[name]
  }
  setValue(value) {
    this.setState(({ values }) => ({
      values: {
        ...values,
        ...value
      }
    }))
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
  getValue: func,
  setValue: func
}

Form.defaultProps = {
  values: {},
  onSubmit: () => {}
}
