import { Component } from 'react'
import { any, func, string } from 'prop-types'
import { wrapInput } from './with-form'

export class RadioGroup extends Component {
  getChildContext() {
    const { name, handleChange, value: groupValue } = this.props
    return { name, groupValue, handleChange }
  }
  render() {
    return this.props.children
  }
}

RadioGroup.childContextTypes = {
  name: string,
  groupValue: any,
  handleChange: func
}

RadioGroup.defaultProps = {
  children: []
}

export default wrapInput(RadioGroup)
