import React, { Component } from 'react'
import { func, string } from 'prop-types'

const isUndefined = value => typeof value === 'undefined'

export function wrapCheckbox(Checkbox) {
  class Field extends Component {
    constructor(...args) {
      super(...args)
      this.handleChange = this.handleChange.bind(this)
    }
    handleChange({ target }) {
      const name = target.getAttribute('name')
      this.context.setValue({ [name]: target.checked })
    }
    componentWillMount() {
      const { setValue, getValue } = this.context
      const { name, checked } = this.props
      if (isUndefined(getValue(name))) {
        setValue({ [name]: !!checked })
      }
    }
    render() {
      const { handleChange, context: { getValue } } = this
      const { name, ...props } = this.props
      const checked = getValue(name)
      const controlProps = { name, checked, handleChange, ...props }
      return <Checkbox {...controlProps}/>
    }
  }
  Field.propTypes = {
    name: string.isRequired
  }
  Field.contextTypes = {
    setValue: func.isRequired,
    getValue: func.isRequired
  }
  return Field
}

export function wrapInput(Input) {
  class Field extends Component {
    constructor(...args) {
      super(...args)
      this.handleChange = this.handleChange.bind(this)
    }
    handleChange({ target }) {
      const name = target.getAttribute('name')
      this.context.setValue({ [name]: target.value })
    }
    componentWillMount() {
      const { setValue, getValue } = this.context
      const { name, value } = this.props
      if (isUndefined(getValue(name))) {
        setValue({ [name]: value })
      }
    }
    render() {
      const { handleChange, context: { getValue } } = this
      const { name, ...props } = this.props
      const value = getValue(name)
      const controlProps = { name, value, handleChange, ...props }
      return <Input {...controlProps}/>
    }
  }
  Field.propTypes = {
    ...Input.propTypes,
    name: string.isRequired
  }
  Field.contextTypes = {
    ...Input.contextTypes,
    setValue: func.isRequired,
    getValue: func.isRequired
  }
  return Field
}
