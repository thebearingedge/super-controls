import { Component } from 'react'
import { func, string } from 'prop-types'
import createControl from '../create-control'

class RadioGroup extends Component {
  constructor(...args) {
    super(...args)
    this.onChange = this.onChange.bind(this)
  }
  getChildContext() {
    const { onChange } = this
    const { value: groupValue } = this.props
    return { groupValue, onChange }
  }
  onChange(event) {
    this.props.onChange(event)
    this.props.onBlur(event)
  }
  render() {
    return this.props.children
  }
}

RadioGroup.childContextTypes = {
  groupValue: string,
  onChange: func,
  onBlur: func
}

export default createControl(RadioGroup)({
  defaultProps: {
    value: ''
  }
})
