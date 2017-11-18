import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ field, control, ...ownProps }) =>
  createElement('select', { ...ownProps, ...control })
)({
  displayName: 'Select',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
