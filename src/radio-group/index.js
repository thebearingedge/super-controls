import { Component } from 'react'
import { func, string } from 'prop-types'
import field from '../field'
import controlled from '../controlled'

export class RadioGroup extends Component {
  getChildContext() {
    const { name, value, onChange } = this.props
    return {
      groupValue: value,
      onChange,
      name
    }
  }
  render() {
    return this.props.children
  }
}

RadioGroup.defaultProps = {
  value: '',
  children: []
}

RadioGroup.childContextTypes = {
  name: string,
  onChange: func,
  groupValue: string
}

export default field(controlled(RadioGroup))()
