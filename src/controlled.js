import { PureComponent, createElement } from 'react'
import inputTypes from './input-types'

export default function controlled(type) {

  class Control extends PureComponent {
    render() {
      const { id, name, ...props } = this.props
      const controlProps = {
        id: id === true ? name : id,
        ...props,
        name
      }
      return type in inputTypes
        ? createElement('input', { ...controlProps, type })
        : createElement(type, controlProps)
    }
  }

  const isCheckbox = type === 'checkbox'
  const defaultValue = isCheckbox ? false : ''
  const valueKey = isCheckbox ? 'checked' : 'value'

  Control.defaultProps = {
    [valueKey]: defaultValue
  }

  return Control
}
