import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ field, control, ...ownProps }) =>
  createElement('textarea', { ...ownProps, ...control })
)({
  displayName: 'TextArea',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
