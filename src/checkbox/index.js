import { createElement } from 'react'
import createControl from '../create-control'

export default createControl(({ field, ...props }) =>
  createElement('input', { ...props, type: 'checkbox' })
)({
  targetKey: 'checked',
  displayName: 'Checkbox',
  defaultProps: {
    checked: false
  }
})
