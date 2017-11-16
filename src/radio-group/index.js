import { Component } from 'react'
import { func, string } from 'prop-types'
import createControl from '../create-control'

class RadioGroup extends Component {
  getChildContext() {
    const { value: groupValue, onBlur, onChange } = this.props
    return { groupValue, onBlur, onChange }
  }
  render() {
    return this.props.children
  }
}

RadioGroup.childContextTypes = {
  groupValue: string,
  onBlur: func,
  onChange: func
}

export default createControl(RadioGroup)({
  defaultProps: {
    value: ''
  }
})
