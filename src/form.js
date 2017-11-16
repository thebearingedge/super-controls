import { Component, createElement } from 'react'
import { func } from 'prop-types'
import { noop } from './util'

function modelField(form, name, value) {
  return {
    state: {
      get value() {
        return form.state.values[name] === void 0
          ? value
          : form.state.values[name]
      },
      get isTouched() {
        return form.state.touched[name] || false
      }
    },
    setValue(value) {
      form.setValue(name, value)
    },
    setTouched() {
      form.setTouched(name)
    }
  }
}

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: this.props.values,
      touched: {}
    }
    this.fields = {}
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setValue = this.setValue.bind(this)
    this.setTouched = this.setTouched.bind(this)
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  setValue(name, value) {
    this.setState(({ values }) => ({
      values: {
        ...values,
        [name]: value
      }
    }))
  }
  setTouched(name) {
    this.setState(({ touched }) => ({
      touched: {
        ...touched,
        [name]: true
      }
    }))
  }
  registerField({ name, value }) {
    const { state, fields, setValue } = this
    fields[name] = modelField(this, name, value)
    if (state.values[name] === void 0) {
      setValue(name, fields[name].state.value)
    }
    return fields[name]
  }
  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.state.values)
  }
  onReset(event) {
    event.preventDefault()
    this.setState({
      touched: {},
      values: this.props.values
    })
  }
  render() {
    const { props, onReset, onSubmit } = this
    return createElement('form', { ...props, onReset, onSubmit })
  }
}

Form.childContextTypes = {
  registerField: func
}

Form.defaultProps = {
  values: {},
  children: [],
  onSubmit: noop
}
