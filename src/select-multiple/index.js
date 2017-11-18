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
    const { field, control, ...ownProps } = this.props
    const { onChange } = this
    const props = {
      ...ownProps,
      ...control,
      onChange,
      multiple: true
    }
    return createElement('select', props)
  }
}

SelectMultiple.propTypes = {
  field: object,
  control: object,
  onChange: func,
  value: array
}

SelectMultiple.defaultProps = {
  value: [],
  multiple: true
}

export default createControl(SelectMultiple)()
