import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.state.blurs = 0
    this.state.visits = 0
    this.state.touched = {}
    this.state.visited = {}
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
    this.touchAll = this.touchAll.bind(this)
  }
  get values() {
    return this.state.value
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
    const { init, value, touched, visited, visits } = this.state
    this.setState({
      visits,
      init: _.unset(init, names),
      value: _.unset(value, names),
      touched: _.unset(touched, names),
      visited: _.unset(visited, names)
    })
    const [ first, ...rest ] = names
    this.fields = rest.length
      ? _.set(this.fields, [first], this.fields[first].unregister(rest))
      : _.unset(this.fields, [first])
    return this
  }
  patch(names, state, options) {
    if (!names.length) return super.patch(state, options)
    const { init, value, touched, isTouched, visited, isVisited } = state
    const nextState = _.assign({}, this.state)
    if (state.isTouched) nextState.blurs += 1
    if (state.isVisited) nextState.visits += 1
    if ('init' in state) {
      nextState.init = _.set(this.state.init, names, init)
    }
    if ('value' in state) {
      nextState.value = _.set(this.state.value, names, value)
    }
    if ('touched' in state || 'isTouched' in state) {
      nextState.touched = _.set(this.state.touched, names, touched || isTouched)
    }
    if ('visited' in state || 'isVisited' in state) {
      nextState.visited = _.set(this.state.visited, names, visited || isVisited)
    }
    this.setState(nextState, options)
    const [ first, ...rest ] = names
    const child = this.fields[first]
    child instanceof FieldSetModel
      ? child.patch(rest, state, options)
      : child.patch(state, options)
    return this
  }
  change(path, value) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && this.root.patch([...this.names, ...names], { value })
  }
  touch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && this.root.patch([...this.names, ...names], { isTouched: true })
  }
  untouch(path) {
    const names = _.toNames(path)
    const field = this.getField(names)
    field && this.root.patch([...this.names, ...names], { isTouched: false })
  }
  touchAll() {
    _.keys(this.fields).forEach(key => {
      _.invoke(this.fields[key].touchAll || this.fields[key].touch)
    })
  }
  static get create() {
    return (root, init = {}, route, checks) =>
      super.create(root, init, route, checks)
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
      'value', 'visits', 'touched', 'visited'
    ]), _.pick(this.model, [
      'change', 'touch', 'touchAll', 'untouch'
    ]), {
      values: this.state.value,
      isFocused: this.state.isFocused,
      anyTouched: _.someValues(this.state.touched, _.id)
    })
  }
  subscriber(nextState) {
    if (!this.state) {
      return this.setState(_.assign(nextState, { isFocused: false }))
    }
    this.setState(state => _.assign({}, nextState, {
      isFocused: nextState.visits > state.visits ||
                 (state.isFocused && nextState.blurs <= state.blurs)
    }))
  }
  register({ route, ...params }) {
    return this.context['@@super-controls'].register({
      ...params,
      route: [_.wrap(this.props.name), ...route]
    })
  }
  getChildContext() {
    return { '@@super-controls': { register: this.register } }
  }
  render(props) {
    const { render, component, children } = this.props
    if (_.isFunction(render) ||
        _.isFunction(component) ||
        _.isFunction(children)) {
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