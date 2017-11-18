import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ field, control, ...ownProps }) =>
  createElement('input', { ...ownProps, ...control, type: 'text' })
)({
  displayName: 'Text',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
