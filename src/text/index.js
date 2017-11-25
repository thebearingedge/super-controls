import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ control, ...props }) =>
  createElement('input', { ...props, ...control, type: 'text' })
)({
  displayName: 'Text',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
