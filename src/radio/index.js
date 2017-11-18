import { createElement } from 'react'
import { func, string } from 'prop-types'

export default function Radio(props, context) {
  const { group, onBlur, onChange } = context
  const { value, ...ownProps } = props
  return createElement('input', {
    ...ownProps,
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
