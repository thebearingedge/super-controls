import { Component, createElement } from 'react'
import { func, object, string, number, oneOfType } from 'prop-types'
import { equalProps, omit } from './util'

export default class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.fieldSet = this.context.registerFieldSet({
      paths: [_ => this.props.name],
      value: this.props.values
    })
    this.state = { mutations: this.fieldSet.mutations }
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
           nextState.mutations !== this.fieldSet.mutations
  }
  componentDidUpdate() {
    this.setState({ mutations: this.fieldSet.mutations })
  }
  registerField({ paths, value }) {
    const field = this.context.registerField({
      paths: [_ => this.props.name, ...paths],
      value
    })
    const { update } = field
    field.update = (...args) => {
      this.fieldSet.mutations++
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
  registerFieldSet: func,
  registerFieldArray: func
}

FieldSet.contextTypes = {
  registerField: func.isRequired,
  registerFieldSet: func.isRequired,
  registerFieldArray: func.isRequired
}
