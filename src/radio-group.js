import { Component } from 'react'
import { func, string, array, object } from 'prop-types'
import createControl from './create-control'

class RadioGroup extends Component {
  constructor(...args) {
    super(...args)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  getChildContext() {
    const { value: group } = this.props.control
    const { onBlur, onChange } = this
    return { group, onBlur, onChange }
  }
  onBlur() {
    setTimeout(() =>
      this.props.field.isTouched ||
      this.props.field.update({ isTouched: true })
    )
  }
  onChange({ target: { value } }) {
    this.props.field.update({ value, isTouched: true })
  }
  render() {
    return this.props.children
  }
}

RadioGroup.childContextTypes = {
  group: string,
  onBlur: func,
  onChange: func
}

RadioGroup.propTypes = {
  field: object,
  control: object,
  children: array,
  value: string
}

export default createControl(RadioGroup)({
  injectField: true,
  defaultProps: {
    value: ''
  }
})
