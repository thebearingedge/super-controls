import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.touchAll = this.touchAll.bind(this)
    this.untouchAll = this.untouchAll.bind(this)
  }
  get values() {
    return this.state.value
  }
  getState() {
    const { visits, touches, value, ...state } = this.state
    return {
      ...state,
      values: value,
      anyVisited: !!visits,
      anyTouched: !!touches
    }
  }
  register(names, field) {
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].register(rest, field))
      : _.set(this.fields, [first], field)
    return this.patch(names, field.state)
  }
  getField([ name, ...names ]) {
    if (!this.fields[name]) return null
    return names.length
      ? this.fields[name].getField(names)
      : this.fields[name]
  }
  unregister(names) {
    this.setState({
      init: _.unset(this.state.init, names),
      value: _.unset(this.state.value, names)
    })
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].unregister(rest))
      : _.unset(this.fields, [first])
    return this
  }
  patch(names, state, options) {
    if (!names.length) return super.patch(state, options)
    const next = _.assign({}, state)
    if ('init' in state) {
      next.init = _.set(this.state.init, names, state.init)
    }
    if ('value' in state) {
      next.value = _.set(this.state.value, names, state.value)
    }
    super.patch(next, options)
    const [ first, ...rest ] = names
    const field = this.fields[first]
    field instanceof FieldSetModel
      ? field.patch(rest, state, options)
      : field.patch(state, options)
    return this
  }
  change(path, value) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.change(value)
  }
  touch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.touch()
  }
  untouch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && field.untouch()
  }
  touchAll() {
    _.keys(this.fields).forEach(key => {
      _.invoke(this.fields[key].touchAll || this.fields[key].touch)
    })
  }
  untouchAll() {
    _.keys(this.fields).forEach(key => {
      _.invoke(this.fields[key].untouchAll || this.fields[key].untouch)
    })
  }
  static create(root, init = {}, route, checks) {
    return super.create(root, init, route, checks)
  }
}

export class View extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.register = this.register.bind(this)
  }
  get Model() {
    return Model
  }
  get prop() {
    return _.assign(_.omit(super.prop, [
      'value'
    ]), _.pick(this.model, [
      'change', 'touch', 'touchAll', 'untouch', 'untouchAll'
    ]), _.pick(this.state, [
      'values', 'anyVisited', 'anyTouched'
    ]))
  }
  register({ route, ...params }) {
    return this.context['@@super-controls'].register({
      ...params,
      route: [_ => this.props.name, ...route]
    })
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } }
  }
  render(props) {
    if (_.isFunction(this.props.render) ||
        _.isFunction(this.props.component) ||
        _.isFunction(this.props.children)) {
      return super.render({ fields: this.prop })
    }
    return super.render()
  }
  static get displayName() {
    return 'FieldSet'
  }
  static get childContextTypes() {
    return this.contextTypes
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: PropTypes.object.isRequired,
      children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.func, PropTypes.element
      ])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: {},
      component: 'fieldset'
    }
  }
}
