import * as SuperControl from './super-control'
import * as _ from './util'

export class Model extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.state.visits = 0
    this.state.touched = {}
    this.state.visited = {}
  }
  get values() {
    return this.state.value
  }
  get prop() {
    const prop = _.omit(super.prop, ['visits', 'touched', 'visited'])
    return _.assign(prop, {
      values: this.values,
      anyTouched: _.someValues(this.state.touched, _.id)
    })
  }
  register([ name, ...names ], field) {
    this.fields = names.length
      ? _.set(this.fields, [name], this.fields[name].register(names, field))
      : _.set(this.fields, [name], field)
    if (this.fields[name] === field) {
      this.form.update(field.names, field.state)
    }
    return this
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
    const [ name, ..._names ] = names
    this.fields = _names.length
      ? _.set(this.fields, [name], this.fields[name].unregister(_names))
      : _.unset(this.fields, [name])
    return this
  }
  update(names, state, options) {
    if (!names.length) {
      return this.setState(_.defaults(state, this.state), options)
    }
    const { init, value, touched, isTouched, visited, isVisited } = state
    const nextState = _.assign({}, this.state)
    if ('isFocused' in state) {
      nextState.visits += 1
    }
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
    this.fields[names[0]].update(names.slice(1), state, options)
    return this
  }
}
