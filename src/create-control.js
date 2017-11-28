import { createElement, Component } from 'react'
import { func, string, number, oneOfType } from 'prop-types'
import { isUndefined, equalProps, omit } from './util'

export default function createControl(component) {

  return function configureControl({
    propTypes,
    displayName,
    defaultProps,
    valueKey = 'value',
    injectField = false
  } = {}) {

    component.displayName = displayName ||
                            component.displayName ||
                            component.name

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = this.context.registerField({
          paths: [() => this.props.name],
          value: this.props[valueKey]
        })
        this.state = { mutations: this.field.mutations }
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
      }
      onChange({ target }) {
        this.field.update({ value: target[valueKey] })
      }
      onBlur() {
        this.field.isTouched ||
        this.field.update({ isTouched: true })
      }
      componentDidUpdate() {
        this.setState({ mutations: this.field.mutations })
      }
      shouldComponentUpdate(nextProps, nextState) {
        return !equalProps(this.props, nextProps) ||
               nextState.mutations !== this.field.mutations
      }
      render() {
        const { id, name, ...props } = this.props
        const { field, onBlur, onChange } = this
        const control = {
          name,
          onBlur,
          onChange,
          [valueKey]: field.value
        }
        if (!isUndefined(id)) control.id = id === true ? name : id
        const componentProps = {
          ...omit(props, [valueKey]),
          control
        }
        if (injectField) componentProps.field = field
        return createElement(component, componentProps)
      }
    }

    Control.propTypes = {
      ...propTypes,
      name: oneOfType([string, number]).isRequired
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = defaultProps

    return Control
  }
}
