import { Component } from 'react'
import { string, shape, func, number, oneOfType } from 'prop-types'
import * as _ from './util'

export class View extends Component {
  constructor(...args) {
    super(...args)
    this.register = this.register.bind(this)
  }
  componentWillMount() {
    this.model = this.context['@@super-controls'].register({
      init: this.getInit(),
      paths: [_ => this.props.name],
      model: (...args) => this.modelField(...args, {
        notify: this.props.notify,
        validate: this.props.validate
      })
    })
    this.setState(this.model.toState())
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !_.equalProps(this.props, nextProps) ||
           !_.deepEqual(this.model.toState(), nextState)
  }
  componentDidUpdate() {
    this.setState(this.model.toState())
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
      override: func,
      name: oneOfType([string, number]).isRequired
    }
  }
  static get defaultProps() {
    return {
      override: _.id,
      notify: _.noop,
      validate: _.noop,
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
  constructor(id, form, init, paths, { notify, validate, override } = {}) {
    this.id = id
    this.form = form
    this._init = init
    this._path = paths
    this._notify = notify || _.noop
    this._validate = validate || _.noop
    this._override = override || _.id
    this.check = this.check.bind(this)
  }
  get path() {
    return this._path.map(_.invoke)
  }
  get init() {
    return this.form.getInit(this.path, this._init)
  }
  get value() {
    return this.form.getValue(this.path, this.init)
  }
  get error() {
    return this.form.getError(this.id)
  }
  get notice() {
    return this.form.getNotice(this.id)
  }
  check(value, values, method) {
    return { [this.id]: this[`_${method}`](value, values) || null }
  }
  unregister() {
    this.form.unregister(this)
  }
}
