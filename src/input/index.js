import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from '../create-control'

export default createControl(({ control, ...props }) =>
  createElement('input', { ...props, ...control })
)({
  displayName: 'Input',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
