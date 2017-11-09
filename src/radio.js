import React from 'react'
import { any, func, string } from 'prop-types'

export default function Radio({
  value: ownValue,
  ...props
}, {
  name,
  groupValue,
  handleChange
}) {
  return (
    <input
      {...props}
      name={name}
      type='radio'
      value={ownValue}
      onChange={handleChange}
      checked={ownValue === groupValue}/>
  )
}

Radio.contextTypes = {
  groupValue: any,
  name: string.isRequired,
  handleChange: func.isRequired
}
