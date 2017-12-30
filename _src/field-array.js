import PropTypes from 'prop-types'
import * as _ from './util'
import * as FieldSet from './field-set'

let key = 0

export const Model = class FieldArrayModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.fields = []
    this.at = this.at.bind(this)
    this.insert = this.insert.bind(this)
    this.push = this.push.bind(this)
    this.unshift = this.unshift.bind(this)
    this.remove = this.remove.bind(this)
    this.pop = this.pop.bind(this)
    this.shift = this.shift.bind(this)
    this.clear = this.clear.bind(this)
    this.forEach = this.forEach.bind(this)
    this.map = this.map.bind(this)
    this.keys = this.state.value.map(_ => ++key)
  }
  getState() {
    const { values, ...state } = super.getState()
    const { length } = values
    return { length, values, ...state }
  }
  at(index) {
    return this.state.value[index]
  }
  forEach(procedure) {
    this.state.value.forEach((value, index) => procedure(value, index, this))
  }
  map(transform) {
    return this.keys.map((key, index) => {
      return transform(this.state.value[index], index, this, key)
    })
  }
  insert(index, value) {
    this.keys = _.sliceIn(this.keys, index, ++key)
    this.fields = _.sliceIn(this.fields, index, void 0)
    this.root.patch(this.names, {
      init: _.sliceIn(this.state.value, index, value),
      value: _.sliceIn(this.state.value, index, value)
    })
  }
  push(value) {
    this.insert(this.state.value.length, value)
  }
  unshift(value) {
    this.insert(0, value)
  }
  remove(index) {
    this.keys = _.remove(this.keys, index)
    this.fields = _.remove(this.fields, index)
    this.root.patch(this.names, {
      init: _.remove(this.state.init, index),
      value: _.remove(this.state.value, index)
    })
  }
  clear() {
    this.keys = []
    this.root.patch(this.names, {
      init: [],
      value: []
    })
  }
  pop() {
    this.remove(this.state.value.length - 1)
  }
  shift() {
    this.remove(0)
  }
  static create(root, init = [], route, checks) {
    return super.create(root, init, route, checks)
  }
}

export class View extends FieldSet.View {
  get Model() {
    return Model
  }
  get prop() {
    return _.assign(super.prop, _.pick(this.model, [
      'at', 'forEach', 'map',
      'insert', 'push', 'unshift',
      'remove', 'pop', 'shift', 'clear'
    ]))
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
