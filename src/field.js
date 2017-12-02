import { Component, createElement } from 'react'
import { oneOfType, any, bool, func, string, number, shape } from 'prop-types'
import { KEY, invoke, equalProps, isBoolean, isString } from './util'

export class Field extends Component {
  constructor(...args) {
    super(...args)
    this.model = this.context[KEY].register({
      init: this.props.init,
      model: this.modelField,
      paths: [_ => this.props.name]
    })
    this.state = {
      value: this.model.value,
      isTouched: this.model.isTouched
    }
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onChange({ target: { type, value, checked } }) {
    this.model.update({
      value: type === 'checkbox' ? !!checked : value
    })
  }
  onBlur() {
    this.model.isTouched ||
    this.model.update({ isTouched: true })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalProps(this.props, nextProps) ||
           this.model.value !== nextState.value ||
           this.model.isTouched !== nextState.isTouched
  }
  componentDidUpdate() {
    const { value, isTouched } = this.model
    this.setState({ value, isTouched })
  }
  componentWillUnmount() {
    this.model.unregister()
  }
  modelField(form, init, paths) {
    return modelField(form, init, paths)
  }
  render() {
    const { id, name, init, component, children, ...props } = this.props
    const { onBlur, onChange, model } = this
    const { value } = model
    const control = {
      name,
      onBlur,
      onChange,
      [isBoolean(value) ? 'checked' : 'value']: value
    }
    if (id && isBoolean(id)) control.id = name
    if (isString(component)) {
      return createElement(component, {
        id,
        ...control,
        ...props
      })
    }
    return createElement(component || children, {
      field: model,
      control,
      id,
      ...props
    })
  }
  static get propTypes() {
    return {
      init: any,
      children: func,
      id: oneOfType([string, bool]),
      component: oneOfType([string, func]),
      name: oneOfType([string, number]).isRequired
    }
  }
  static get defaultProps() {
    return {
      init: '',
      children: _ => null
    }
  }
  static get contextTypes() {
    return {
      [KEY]: shape({
        register: func.isRequired
      }).isRequired
    }
  }
}

export const modelField = (form, init, paths) => {
  const model = {
    get init() {
      return form.getInit(this.path, init)
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return !!form.getTouched(this.path)
    },
    get isDirty() {
      return this.value !== this.init
    },
    get isPristine() {
      return !this.isDirty
    }
  }
  return Object.defineProperties(model, {
    path: {
      get: _ => paths.map(invoke)
    },
    update: {
      configurable: true,
      value: state => form.update(model.path, state)
    },
    unregister: {
      configurable: true,
      value: _ => form.unregister(model)
    }
  })
}
