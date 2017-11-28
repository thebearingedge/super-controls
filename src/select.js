import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from './create-control'

export default createControl(({ control, ...props }) =>
  createElement('select', { ...control, ...props })
)({
  displayName: 'Select',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
