import { createElement, Component } from 'react'
import { func, string } from 'prop-types'
import { shallowEqual } from '../util'

export default function createControl(component) {

  return function configureControl({
    propTypes,
    displayName,
    defaultProps,
    valueKey = 'value'
  } = {}) {

    component.displayName = displayName ||
                            component.displayName ||
                            component.name

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = this.context.registerField({
          name: this.props.name,
          value: this.props[valueKey]
        })
        this.state = { ...this.field.state }
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
      }
      onChange({ target }) {
        this.field.update({ value: target[valueKey] })
      }
      onBlur() {
        this.field.state.isTouched ||
        this.field.update({ isTouched: true })
      }
      componentDidUpdate() {
        this.setState(this.field.state)
      }
      shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.field.state, nextState) ||
               !shallowEqual(this.props, nextProps)
      }
      render() {
        const { id, name, ...props } = this.props
        const { field, onBlur, onChange } = this
        const control = {
          name,
          onBlur,
          onChange,
          [valueKey]: field.state.value
        }
        if (id !== void 0) {
          control.id = id === true
            ? name
            : id
        }
        return createElement(component, {
          ...props,
          field,
          control
        })
      }
    }

    Control.propTypes = {
      ...propTypes,
      name: string.isRequired
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = defaultProps

    return Control
  }
}
