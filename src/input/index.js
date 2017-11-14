import { createElement } from 'react'
import createControl from '../create-control'

export default createControl(({ field, ...props }) =>
  createElement('input', props)
)({
  displayName: 'Input',
  defaultProps: {
    value: ''
  }
})
