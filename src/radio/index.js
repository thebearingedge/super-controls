import { createElement, Component } from 'react'
import { func, string } from 'prop-types'

export default class Radio extends Component {
  render() {
    const { groupValue, onBlur, onChange } = this.context
    const { value, ...props } = this.props
    return createElement('input', {
      ...props,
      value,
      onBlur,
      onChange,
      type: 'radio',
      checked: value === groupValue,
      ref: this.context.registerRadio
    })
  }
}

Radio.contextTypes = {
  groupValue: string.isRequired,
  onBlur: func.isRequired,
  onChange: func.isRequired
}

Radio.propTypes = {
  value: string.isRequired
}
