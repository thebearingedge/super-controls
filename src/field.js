import React, { Component } from 'react'
import { func, string } from 'prop-types'

export default function field(Control) {

  const valueKey = 'value' in Control.defaultProps
    ? 'value'
    : 'checked'

  class Field extends Component {
    constructor(...args) {
      super(...args)
      this.state = { value: this.props[valueKey] }
      this.onChange = this.onChange.bind(this)
    }
    onChange({ target }) {
      const value = target[valueKey]
      this.setState({ value }, () => {
        this.context.setValue &&
        this.context.setValue({ [target.name]: value })
      })
    }
    componentWillMount() {
      if (!this.context.getValue) return
      const value = this.context.getValue(this.props.name)
      if (typeof value !== 'undefined') {
        this.setState({ value })
      }
    }
    render() {
      const { props, onChange, state: { value } } = this
      const controlProps = {
        ...props,
        [valueKey]: value,
        onChange
      }
      return <Control {...controlProps}/>
    }
  }

  Field.propTypes = {
    name: string.isRequired
  }

  Field.contextTypes = {
    setValue: func,
    getValue: func
  }

  return Field
}
