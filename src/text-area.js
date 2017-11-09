import React from 'react'
import { wrapInput } from './with-form'

export const TextArea = ({ handleChange, ...props }) =>
  <textarea {...props} onChange={handleChange}/>

TextArea.defaultProps = {
  value: ''
}

export default wrapInput(TextArea)
