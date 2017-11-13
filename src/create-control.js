import { createElement, Component } from 'react'
import { bool, func, string } from 'prop-types'
import shallowEqual from 'shallow-equal/objects'
import inputTypes from './input-types'

export default function createControl(type) {

  const isCheckbox = type === 'checkbox'
  const isRadio = type === 'radio'
  const valueKey = isCheckbox ? 'checked' : 'value'

  return function configureControl({
    propTypes,
    displayName,
    defaultProps
  } = {}) {

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = null
        this.state = { value: this.props[valueKey] }
        this.onChange = this.onChange.bind(this)
        this.setValue = this.setValue.bind(this)
      }
      onChange({ target }) {
        this.setValue(target[valueKey])
      }
      setValue(value) {
        this.field.setValue(value)
        this.setState({ value })
      }
      componentWillMount() {
        const { name, checked } = this.props
        const value = isRadio && !checked
          ? void 0
          : this.state.value
        this.field = this.context.registerField({
          name,
          value
        })
        this.setState(this.field.state)
      }
      shouldComponentUpdate(nextProps, nextState) {
        const { props, state, field } = this
        return !shallowEqual(state, field.state) ||
               !shallowEqual(state, nextState) ||
               !shallowEqual(props, nextProps)
      }
      render() {
        const { onChange } = this
        const { value } = this.state
        const { name, ...props } = this.props
        const checked = isRadio
          ? this.props.value === value
          : void 0
        const id = this.props.id === true
          ? name
          : this.props.id
        const controlProps = {
          ...props,
          id,
          name,
          checked,
          onChange,
          [valueKey]: value
        }
        if (typeof type === 'string') {
          return type in inputTypes
            ? createElement('input', { ...controlProps, type })
            : createElement(type, controlProps)
        }
        const { setValue } = this
        const field = { setValue }
        return createElement(type, { ...controlProps, field })
      }
    }

    Control.propTypes = {
      name: string.isRequired,
      [valueKey]: (isCheckbox ? bool : string).isRequired,
      ...propTypes
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = {
      ...defaultProps
    }

    Control.displayName = displayName

    return Control
  }
}
