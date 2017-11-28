import { Component } from 'react'
import { func, array, string, number, oneOfType } from 'prop-types'
import { equalProps } from './util'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.fieldArray = this.context.registerFieldArray({
      paths: [_ => this.props.name],
      value: this.props.value
    })
    this.state = { mutations: this.fieldArray.mutations }
    this.registerField = this.registerField.bind(this)
    this.registerFieldSet = this.registerFieldSet.bind(this)
    this.registerFieldArray = this.registerFieldArray.bind(this)
  }
  getChildContext() {
    const { registerField, registerFieldSet, registerFieldArray } = this
    return { registerField, registerFieldSet, registerFieldArray }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalProps(this.props, nextProps) ||
           nextState.mutations !== this.fieldArray.mutations
  }
  componentDidUpdate() {
    this.setState({ mutations: this.fieldArray.mutations })
  }
  registerField({ paths, value }) {
    const field = this.context.registerField({
      paths: [_ => this.props.name, ...paths],
      value
    })
    const { update } = field
    field.update = (...args) => {
      this.fieldArray.mutations++
      update(...args)
    }
    return field
  }
  registerFieldSet({ paths, value }) {
    return this.context.registerFieldSet({
      paths: [_ => this.props.name, ...paths],
      value
    })
  }
  registerFieldArray({ paths, value }) {
    return this.context.registerFieldArray({
      paths: [_ => this.props.name, ...paths],
      value
    })
  }
  render() {
    return this.props.children(this.fieldArray)
  }
}

FieldArray.propTypes = {
  name: oneOfType([string, number]).isRequired,
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
