import { Component, createElement } from 'react'
import {
  oneOfType,
  func,
  array,
  object,
  number,
  shape,
  string
} from 'prop-types'
import {
  id,
  KEY,
  invoke,
  isFunction,
  someValues,
  equalProps,
  deepEqual,
  shallowEqual
} from './util'

export class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.model = this.context[KEY].register({
      init: this.props.init,
      model: this.modelField,
      paths: [_ => this.props.name]
    })
    this.state = {
      value: this.model.value,
      touched: this.model.touched
    }
    this.register = this.register.bind(this)
  }
  getChildContext() {
    const { register } = this
    return { [KEY]: { register } }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalProps(this.props, nextProps) ||
           !shallowEqual(this.model.value, nextState.value) ||
           !shallowEqual(this.model.touched, nextState.touched)
  }
  componentDidUpdate() {
    this.setState({
      value: this.model.value,
      touched: this.model.touched
    })
  }
  componentWillUnmount() {
    this.model.unregister()
  }
  modelField(form, init, paths) {
    return modelFieldSet(form, init, paths)
  }
  register({ paths, init, model }) {
    return this.context[KEY].register({
      init,
      model,
      paths: [_ => this.props.name, ...paths]
    })
  }
  render() {
    const { component, children, init, ...props } = this.props
    const { model: fields } = this
    if (isFunction(component)) {
      return createElement(component, {
        fields,
        ...props
      })
    }
    if (isFunction(children)) {
      return createElement(children, {
        fields,
        ...props
      })
    }
    return createElement(component, {
      ...props,
      children
    })
  }
  static get propTypes() {
    return {
      init: object,
      children: oneOfType([object, func, array]),
      name: oneOfType([string, number]).isRequired,
      component: oneOfType([string, func]).isRequired
    }
  }
  static get defaultProps() {
    return {
      init: {},
      component: 'fieldset'
    }
  }
  static get contextTypes() {
    return {
      [KEY]: shape({
        register: func.isRequired
      })
    }
  }
  static get childContextTypes() {
    return {
      [KEY]: shape({
        register: func
      })
    }
  }
}

export const modelFieldSet = (form, init, paths) => {
  const model = {
    get init() {
      return form.getInit(this.path, init)
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return someValues(this.touched, id)
    },
    get isDirty() {
      return !deepEqual(this.init, this.value)
    },
    get isPristine() {
      return !this.isDirty
    }
  }
  return Object.defineProperties(model, {
    path: {
      get: () => paths.map(invoke)
    },
    touched: {
      get: () => form.getTouched(model.path, {})
    },
    unregister: {
      configurable: true,
      value: _ => form.unregister(model)
    }
  })
}
