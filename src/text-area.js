import { createElement } from 'react'
import { string } from 'prop-types'
import createControl from './create-control'

export default createControl(({ control, ...props }) =>
  createElement('textarea', { ...control, ...props })
)({
  displayName: 'TextArea',
  propTypes: {
    value: string
  },
  defaultProps: {
    value: ''
  }
})
