import { createElement } from 'react'
import createControl from '../create-control'

export default createControl(({ field, ...props }) =>
  createElement('textarea', props)
)({
  displayName: 'TextArea',
  defaultProps: {
    value: ''
  }
})
