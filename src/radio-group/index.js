import { Component } from 'react'
import { func, string } from 'prop-types'
import createControl from '../create-control'

class RadioGroup extends Component {
  constructor(...args) {
    super(...args)
    this.onChange = this.onChange.bind(this)
  }
  onChange(event) {
    this.props.onChange(event)
  }
  getChildContext() {
    const { onChange } = this
    return { onChange }
  }
}

RadioGroup.childContextTypes = {
  onChange: func,
  groupValue: string
}

export default createControl()
