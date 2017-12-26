import PropTypes from 'prop-types'
import * as _ from './util'
import * as FieldSet from './field-set'

export const Model = class FormModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.root = this
    this.focused = null
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
  patch(names, state, options) {
    if ('isFocused' in state) this.focused = state.isFocused
    return super.patch(names, state, options)
  }
  static get create() {
    return (name, init, config) =>
      super.create(null, init, [_.wrap(name || null)], config)
  }
}

export class View extends FieldSet.View {
  get Model() {
    return Model
  }
  componentWillMount() {
    const { props: { name }, init, config } = this
    this.model = this.Model.create(name, init, config)
    this.unsubscribe = this.model.subscribe(state => this.subscriber(state))
  }
  register(...args) {
    return this.model.register(...args)
  }
  static get displayName() {
    return 'Form'
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      name: PropTypes.string
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      component: 'form'
    }
  }
}
