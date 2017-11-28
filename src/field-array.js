import { Component } from 'react'
import { func, array, string } from 'prop-types'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.fieldArray = this.context.registerFieldArray({
      paths: [_ => this.props.name],
      value: this.props.value
    })
    this.registerFieldArray = this.registerFieldArray.bind(this)
    this.registerFieldSet = this.registerFieldSet.bind(this)
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField, registerFieldSet, registerFieldArray } = this
    return { registerField, registerFieldSet, registerFieldArray }
  }
  registerField({ paths, value }) {

  }
  registerFieldSet({ paths, value }) {

  }
  registerFieldArray({ paths, value }) {

  }
  render() {
    return this.props.children(this.fieldArray)
  }
}

FieldArray.propTypes = {
  name: string.isRequired,
  children: func,
  value: array
}

FieldArray.defaultProps = {
  value: [],
  children: _ => null
}

FieldArray.contextTypes = {
  registerFieldArray: func.isRequired,
  registerFieldSet: func.isRequired,
  registerField: func.isRequired
}

FieldArray.childContextTypes = {
  registerFieldArray: func,
  registerFieldSet: func,
  registerField: func
}
