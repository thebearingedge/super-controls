import { Component, createElement } from 'react'
import { object, func } from 'prop-types'
import { noop, expand } from '../util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: this.props.values,
      touched: {}
    }
    this.fields = {}
    this.update = this.update.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  registerField({ name, value }) {
    const { fields } = this
    fields[name] = this.constructor.modelField(this, name, value)
    this.update(name, { ...fields[name].state })
    return fields[name]
  }
  update(name, state) {
    this.setState(({ values, touched }) => {
      const nextState = { values, touched }
      switch (true) {
        case 'value' in state:
          nextState.values = { ...values, [name]: state.value }
        case 'isTouched' in state:
          nextState.touched = { ...touched, [name]: !!state.isTouched }
      }
      return nextState
    })
  }
  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(expand(this.state.values))
  }
  onReset(event) {
    event.preventDefault()
    const { values } = this.props
    this.setState({
      values: values,
      touched: Object.keys(values).reduce((touched, name) => ({
        ...touched,
        [name]: false
      }), {})
    })
  }
  static modelField(form, name, value) {
    return {
      state: {
        get init() {
          return value
        },
        get value() {
          return name in form.state.values
            ? form.state.values[name]
            : value
        },
        get isTouched() {
          return !!form.state.touched[name]
        },
        get isDirty() {
          return this.value !== this.init
        }
      },
      update(state) {
        form.update(name, state)
      }
    }
  }
  render() {
    const { props, onReset, onSubmit } = this
    return createElement('form', { ...props, onReset, onSubmit })
  }
}

Form.childContextTypes = {
  registerField: func
}

Form.propTypes = {
  values: object,
  onSubmit: func
}

Form.defaultProps = {
  values: {},
  children: [],
  onSubmit: noop
}
