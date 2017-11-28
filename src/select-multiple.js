import { Component, createElement } from 'react'
import { object, array } from 'prop-types'
import createControl from './create-control'

class SelectMultiple extends Component {
  constructor(...args) {
    super(...args)
    this.onChange = this.onChange.bind(this)
  }
  onChange({ target }) {
    const value = [...target.querySelectorAll('option:checked')]
      .map($option => $option.value)
    this.props.control.onChange({ target: { value } })
  }
  render() {
    const { control, ...props } = this.props
    const { onChange } = this
    return createElement('select', {
      ...control,
      onChange,
      ...props,
      multiple: true
    })
  }
}

SelectMultiple.propTypes = {
  control: object,
  value: array
}

export default createControl(SelectMultiple)({
  defaultProps: {
    value: []
  }
})
