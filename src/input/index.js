import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ field, control, ...ownProps }) =>
  createElement('input', { ...ownProps, ...control })
)({
  displayName: 'Input',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
