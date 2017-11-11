import { createElement, Component } from 'react'
import { func, string } from 'prop-types'

export default class Radio extends Component {
  render() {
    const { name, onChange, groupValue } = this.context
    const { value, ...props } = this.props
    const checked = value === groupValue
    return createElement('input', {
      ...props,
      type: 'radio',
      onChange,
      checked,
      value,
      name
    })
  }
}

Radio.propTypes = {
  value: string.isRequired
}

Radio.contextTypes = {
  name: string,
  onChange: func,
  groupValue: string
}
