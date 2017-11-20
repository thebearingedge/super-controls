import { Component, createElement } from 'react'
import { func, string } from 'prop-types'

export default class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  registerField({ name, value }) {
    return this.context.registerField({
      name: `${this.props.name}.${name}`,
      value
    })
  }
  render() {
    return createElement('fieldset', this.props)
  }
}

FieldSet.propTypes = {
  name: string.isRequired
}

FieldSet.contextTypes = {
  registerField: func
}

FieldSet.childContextTypes = {
  registerField: func
}
