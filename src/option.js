import React from 'react'
import { string } from 'prop-types'

export default function Option(props) {
  return (
    <option {...props}/>
  )
}

Option.propTypes = {
  value: string.isRequired
}
