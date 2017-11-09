import React from 'react'
import { wrapInput } from './with-form'

export const Hidden = ({ handleChange, ...props }) =>
  <input {...props} type='hidden'/>

Hidden.defaultProps = {
  value: ''
}

export default wrapInput(Hidden)
