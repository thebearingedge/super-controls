import React from 'react'
import { wrapInput } from './with-form'

export const TextInput = ({ handleChange, ...props }) =>
  <input {...props} type='text' onChange={handleChange}/>

TextInput.defaultProps = {
  value: ''
}

export default wrapInput(TextInput)
