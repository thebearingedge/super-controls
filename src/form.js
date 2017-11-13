import React, { Component } from 'react'
import { func } from 'prop-types'

export default class Form extends Component {

}

Form.childContextTypes = {
  registerField: func
}

Form.defaultProps = {
  values: {}
}
