import { Component, createElement } from 'react'
import { func, string, number, oneOfType } from 'prop-types'
import { equalProps, omit } from './util'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.model = this.context.registerFieldArray({
      paths: [_ => this.props.name]
    })
    this.state = {
      value: this.model.value,
      touches: this.model.touches
    }
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
           nextState.value !== this.model.value ||
           nextState.touches !== this.model.touches
  }
  componentDidUpdate() {
    this.setState({
      value: this.model.value,
      touches: this.model.touches
    })
  }
  registerField({ paths, value }) {
    const field = this.context.registerField({
      paths: [_ => this.props.name, ...paths],
      value
    })
    const { update } = field
    field.update = state => {
      state.isTouched && this.model.touch()
      update(state)
    }
    return field
  }
  registerFieldSet({ paths }) {
    return this.context.registerFieldSet({
      paths: [_ => this.props.name, ...paths]
    })
  }
  registerFieldArray({ paths }) {
    return this.context.registerFieldArray({
      paths: [_ => this.props.name, ...paths]
    })
  }
  render() {
    const children = this.props.children(this.model)
    return createElement('fieldset', {
      children,
      ...omit(this.props, ['children'])
    })
  }
}

FieldArray.propTypes = {
  name: oneOfType([string, number]).isRequired,
  children: func
}

FieldArray.defaultProps = {
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
