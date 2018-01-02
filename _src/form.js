import PropTypes from 'prop-types'
import * as _ from './util'
import * as FieldSet from './field-set'

export const Model = class FormModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.root = this
    this.state.active = null
    this.isInitialized = false
  }
  get values() {
    return this.state.value
  }
  register({ init, route, config, Model }) {
    const names = route.map(_.invoke)
    const registered = this.getField(names)
    if (registered) return registered
    const value = _.get(this.state.init, names, init)
    const field = Model.create(this, value, route, config)
    super.register(names, field)
    return field
  }
  patch(names, change, options) {
    if ('visits' in change && change.visits > 0) {
      super.patch([], { active: this.getField(names) }, { silent: true })
    }
    if ('touches' in change && change.touches > 0) {
      super.patch([], { active: null }, { silent: true })
    }
    super.patch(names, change, options)
    return this
  }
  reset() {
    const { fields, state: { init } } = this
    _.keys(fields).forEach(key => {
      _.exists(init, key)
        ? fields[key].reset({ quiet: true })
        : this.unregister(fields[key].names, fields[key])
    })
    this.patch([], { value: init, error: null, notice: null })
  }
  static create(name, init, config) {
    return super.create(null, init, [_ => name], config)
  }
}

export class View extends FieldSet.View {
  constructor(...args) {
    super(...args)
    this.handleReset = this.handleReset.bind(this)
  }
  get Model() {
    return Model
  }
  get prop() {
    return _.assign({}, this.state, _.pick(this.model, [
      'reset'
    ]))
  }
  componentWillMount() {
    const { props: { name }, init, config } = this
    this.model = this.Model.create(name, init, config)
    this.unsubscribe = this.model.subscribe(this.setState.bind(this))
  }
  componentDidMount() {
    this.model.isInitialized = true
  }
  register(...args) {
    return this.model.register(...args)
  }
  createControl(fields) {
    return {
      name: this.props.name,
      onReset: this.handleReset(fields)
    }
  }
  handleReset(form) {
    return event => {
      const wrapped = _.wrapEvent(event)
      this.props.onReset(event, form)
      if (wrapped.defaultPrevented) return
      form.reset()
    }
  }
  render() {
    const form = this.prop
    const control = this.createControl(form)
    if (_.isFunction(this.props.render) ||
        _.isFunction(this.props.component) ||
        _.isFunction(this.props.children)) {
      return super.render({ form, control })
    }
    return super.render(control)
  }
  static get displayName() {
    return 'Form'
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      name: PropTypes.string,
      onReset: PropTypes.func
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      onReset: _.noop,
      component: 'form'
    }
  }
}
