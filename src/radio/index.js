import { createElement, Component } from 'react'
import { func, string } from 'prop-types'

export default class Radio extends Component {
  render() {
    const { groupValue, onChange } = this.context
    const { value, ...props } = this.props
    return createElement('input', {
      ...props,
      value,
      onChange,
      type: 'radio',
      checked: value === groupValue
    })
  }
}

Radio.contextTypes = {
  groupValue: string.isRequired,
  onChange: func.isRequired
}

Radio.propTypes = {
  value: string.isRequired
}
