import { Component } from 'react'
import { string, shape, func, number, oneOfType } from 'prop-types'
import { noop, invoke, equalProps, deepEqual } from './util'

export class View extends Component {
  constructor(...args) {
    super(...args)
    this.register = this.register.bind(this)
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      init: this.getInit(),
      model: this.modelField,
      paths: [_ => this.props.name]
    })
    this.setState(this.getState(this.model))
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalProps(this.props, nextProps) ||
           !deepEqual(this.getState(this.model), nextState)
  }
  componentDidUpdate() {
    this.setState(this.getState(this.model))
  }
  componentWillUnmount() {
    this.model.unregister()
  }
  register({ init, model, paths }) {
    return this.context['@@super-controls'].register({
      init,
      model,
      paths: [_ => this.props.name, ...paths]
    })
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } }
  }
  static get propTypes() {
    return {
      notify: func,
      validate: func,
      name: oneOfType([string, number]).isRequired
    }
  }
  static get defaultProps() {
    return {
      notify: noop,
      validate: noop,
      component: _ => null
    }
  }
  static get contextTypes() {
    return {
      '@@super-controls': shape({
        register: func.isRequired
      })
    }
  }
  static get childContextTypes() {
    return this.contextTypes
  }
}

export class Model {
  constructor(form, init, paths, { notify, validate } = {}) {
    this.form = form
    this._init = init
    this.paths = paths
    this.notify = notify || noop
    this.validate = validate || noop
  }
  get path() {
    return this.paths.map(invoke)
  }
  get init() {
    return this.form.getInit(this.path, this._init)
  }
  get value() {
    return this.form.getValue(this.path, this.init)
  }
  unregister() {
    this.form.unregister(this)
  }
}
