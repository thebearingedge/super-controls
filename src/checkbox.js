import React from 'react'
import { wrapCheckbox } from './with-form'

export const Checkbox = ({ handleChange, ...props }) =>
  <input {...props} type='checkbox' onChange={handleChange}/>

Checkbox.defaultProps = {
  checked: false
}

export default wrapCheckbox(Checkbox)
