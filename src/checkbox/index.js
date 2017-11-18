import { createElement } from 'react'
import { bool } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ field, control, ...ownProps }) =>
  createElement('input', { ...ownProps, ...control, type: 'checkbox' })
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
