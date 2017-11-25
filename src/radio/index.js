import { createElement } from 'react'
import { func, string } from 'prop-types'

export default function Radio({ value, ...props }, context) {
  const { group, onBlur, onChange } = context
  return createElement('input', {
    ...props,
    value,
    onBlur,
    onChange,
    type: 'radio',
    checked: value === group
  })
}

Radio.contextTypes = {
  group: string.isRequired,
  onChange: func.isRequired,
  onBlur: func.isRequired
}

Radio.propTypes = {
  value: string.isRequired
}
