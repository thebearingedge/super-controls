import { Component, createElement } from 'react'
import createControl from '../create-control'

class SelectMultiple extends Component {
  constructor(...args) {
    super(...args)
    this.onChange = this.onChange.bind(this)
  }
  onChange(event) {
    const value = [...event.target.querySelectorAll('option:checked')]
      .map($option => $option.value)
    this.props.field.setValue(value)
    return event
  }
  render() {
    const { field, value, children, ...ownProps } = this.props
    const { onChange } = this
    const props = {
      ...ownProps,
      multiple: true,
      onChange,
      value
    }
    return createElement('select', props, children)
  }
}

export default createControl(SelectMultiple)({
  defaultProps: {
    value: []
  }
})
