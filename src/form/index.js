import { Component, createElement } from 'react'
import { object, func } from 'prop-types'
import { noop, expand, collapse } from '../util'

export default class Form extends Component {
  constructor(...args) {
    super(...args)
    const values = collapse(this.props.values)
    const touched = Object
      .keys(values)
      .reduce((touched, key) => ({ ...touched, [key]: false }), {})
    this.state = { values, touched }
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
    let field = this.fields[name] = this.constructor.modelField(this, name, value)
    this.update(name, { ...field.state })
    return field
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
    const values = collapse(this.props.values)
    const touched = Object
      .keys(values)
      .reduce((touched, key) => ({
        ...touched,
        [key]: false
      }), {})
    this.setState({
      values,
      touched
    })
  }
  static modelField(form, name, value) {
    const init = name in form.state.values
      ? form.state.values[name]
      : value
    return {
      state: {
        get init() {
          return init
        },
        get value() {
          return name in form.state.values
            ? form.state.values[name]
            : this.init
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
  onSubmit: noop
}
