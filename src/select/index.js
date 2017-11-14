import { createElement } from 'react'
import createControl from '../create-control'

export default createControl(({ field, ...props }) =>
  createElement('select', props)
)({
  displayName: 'Select',
  defaultProps: {
    value: ''
  }
})
