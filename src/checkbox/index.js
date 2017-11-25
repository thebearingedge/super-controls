import { createElement } from 'react'
import { bool } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ control, ...props }) =>
  createElement('input', { ...props, ...control, type: 'checkbox' })
)({
  valueKey: 'checked',
  displayName: 'Checkbox',
  propTypes: {
    checked: bool
  },
  defaultProps: {
    checked: false
  }
})
