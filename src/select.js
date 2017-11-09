import React from 'react'
import { wrapInput } from './with-form'

export const Select = ({ children, handleChange, ...props }) =>
  <select {...props} onChange={handleChange}>
    { children }
  </select>

export default wrapInput(Select)
