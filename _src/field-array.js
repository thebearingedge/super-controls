import PropTypes from 'prop-types'
import * as FieldSet from './field-set'
import * as _ from './util'

export const Model = class FieldArrayModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.fields = []
    this.state.touched = []
    this.state.visited = []
    this.at = this.at.bind(this)
    this.insert = this.insert.bind(this)
    this.push = this.push.bind(this)
    this.unshift = this.unshift.bind(this)
    this.remove = this.remove.bind(this)
    this.pop = this.pop.bind(this)
    this.shift = this.shift.bind(this)
    this.clear = this.clear.bind(this)
  }
  get length() {
    return this.values.length
  }
  at(index) {
    return this.values[index]
  }
  insert(index, value) {
    this.root.patch(this.names, {
      init: _.sliceIn(this.values, index, value),
      value: _.sliceIn(this.values, index, value),
      touched: _.sliceIn(this.state.touched, index),
      visited: _.sliceIn(this.state.visited, index)
    })
  }
  push(value) {
    this.insert(this.length, value)
  }
  unshift(value) {
    this.insert(0, value)
  }
  remove(index) {
    this.root.patch(this.names, {
      init: _.remove(this.values, index),
      value: _.remove(this.values, index),
      touched: _.remove(this.state.touched, index),
      visited: _.remove(this.state.visited, index)
    })
  }
  clear() {
    this.root.patch(this.names, {
      init: [],
      value: [],
      touched: [],
      visited: []
    })
  }
  pop() {
    this.remove(this.length - 1)
  }
  shift() {
    this.remove(0)
  }
  forEach(procedure) {
    this.values.forEach((value, index) => procedure(value, index, this))
  }
  map(transform) {
    return this.values.map((value, index) => transform(value, index, this))
  }
  static get create() {
    return (root, init = [], route, checks) =>
      super.create(root, init, route, checks)
  }
}

export class View extends FieldSet.View {
  get Model() {
    return Model
  }
  get prop() {
    return _.assign(super.prop, _.pick(this.model, [
      'length', 'at', 'insert', 'push', 'unshift',
      'remove', 'pop', 'shift', 'clear', 'forEach', 'map'
    ]))
  }
  render() {
    return super.render({ fields: this.prop })
  }
  static get displayName() {
    return 'FieldArray'
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: PropTypes.array.isRequired
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: []
    }
  }
}
