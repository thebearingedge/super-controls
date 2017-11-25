import { Component, createElement } from 'react'
import { func, object, array } from 'prop-types'
import createControl from '../create-control'

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
      ...props,
      ...control,
      onChange,
      multiple: true
    })
  }
}

SelectMultiple.propTypes = {
  field: object,
  control: object,
  onChange: func,
  value: array
}

export default createControl(SelectMultiple)({
  defaultProps: {
    value: []
  }
})
