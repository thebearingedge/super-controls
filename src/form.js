import * as _ from './util'
import * as FieldSet from './field-set'

export const Model = class FormModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.form = this
    this.isInitialized = false
    this._state.isSubmitting = false
    this.submit = this.submit.bind(this)
  }
  get names() {
    return []
  }
  get isSubmitting() {
    return this._state.isSubmitting
  }
  getState() {
    return _.assign(super.getState(), _.pick(this, [
      'isSubmitting'
    ]))
  }
  register({ init, route, config, Model }) {
    route = _.isString(route) ? _.toRoute(route) : route
    const names = route.map(_.invoke)
    const registered = this._getField(names)
    if (registered) return registered
    const value = _.get(this._state.init, names, init)
    const field = Model.create(this, value, route, config)
    this._register(names, field)
    return field
  }
  submit() {
    this._patch({ isSubmitting: true })
    const done = err => {
      this._patch({ isSubmitting: false })
      if (err) return Promise.reject(err)
    }
    this.validateAll()
    return _.resolveValues(this.allValidations)
      .then(() => {
        const { allErrors, values, config: { onSubmit } } = this
        return _.someValues(allErrors, _.id)
          ? onSubmit(allErrors, null, this)
          : onSubmit(null, values, this)
      })
      .then(done, done)
  }
  static create(name, init, config = {}) {
    return super.create(null, init, name, _.defaults({}, config, {
      onSubmit: _.noop
    }))
  }
}

export const View = class FormView extends FieldSet.View {
  constructor(...args) {
    super(...args)
    this.handleReset = this.handleReset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  get Model() {
    return Model
  }
  get config() {
    return _.assign(super.config, _.pick(this.props, ['onSubmit']))
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
  get control() {
    const { handleReset, handleSubmit, model: { name } } = this
    const control = {
      onReset: handleReset,
      onSubmit: handleSubmit
    }
    return name ? _.assign(control, { name }) : control
  }
  handleReset(event) {
    const wrapped = _.wrapEvent(event)
    this.props.onReset(wrapped, this.model)
    if (wrapped.defaultPrevented) return
    this.model.reset()
  }
  handleSubmit(event) {
    event.preventDefault()
    this.model.submit()
  }
  render() {
    if (_.isFunction(this.props.render) ||
        _.isFunction(this.props.children) ||
        _.isFunction(this.props.component)) {
      return super.render({ form: this.model, control: this.control })
    }
    return super.render(this.control)
  }
  static get displayName() {
    return 'Form'
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      onReset: _.noop,
      onSubmit: _.noop,
      component: 'form'
    }
  }
}
