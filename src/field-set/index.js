import { Component, createElement } from 'react'
import { func, string } from 'prop-types'
import { equalExcept, equalState } from '../util'

const equalProps = equalExcept('name', 'children')

export default class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.fieldState = {}
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  componentDidUpdate() {
    this.fieldState = Object
      .keys(this.fields)
      .reduce((fieldState, name) => ({
        ...fieldState,
        [name]: { ...this.fields[name].state }
      }), {})
  }
  shouldComponentUpdate(nextProps) {
    const { props, fields, fieldState } = this
    return !equalProps(props, nextProps) ||
           Object
             .keys(fields)
             .some(key => !equalState(fields[key].state, fieldState[key]))
  }
  registerField({ name, value }) {
    const field = this.context.registerField({
      name: `${this.props.name}.${name}`,
      value
    })
    this.fields[name] = field
    this.fieldState[name] = { ...field.state }
    return field
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
