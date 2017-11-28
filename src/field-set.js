import { Component, createElement } from 'react'
import { func, object, string, number, oneOfType } from 'prop-types'
import { omit } from './util'

export default class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.fieldSet = this.context.registerFieldSet({
      paths: [_ => this.props.name],
      value: this.props.values
    })
    this.registerField = this.registerField.bind(this)
    this.registerFieldSet = this.registerFieldSet.bind(this)
  }
  getChildContext() {
    const { registerField, registerFieldSet } = this
    return { registerField, registerFieldSet }
  }
  registerField({ paths, value }) {
    const field = this.context.registerField({
      paths: [_ => this.props.name, ...paths],
      value
    })
    return field
  }
  registerFieldSet({ paths, value }) {
    const field = this.context.registerFieldSet({
      paths: [_ => this.props.name, ...paths],
      value
    })
    return field
  }
  render() {
    return createElement('fieldset', omit(this.props, ['values']))
  }
}

FieldSet.propTypes = {
  name: oneOfType([string, number]).isRequired,
  values: object
}

FieldSet.defaultProps = {
  values: {}
}

FieldSet.childContextTypes = {
  registerField: func,
  registerFieldSet: func
}

FieldSet.contextTypes = {
  registerFieldSet: func.isRequired,
  registerField: func.isRequired
}
