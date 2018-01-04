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
    this.keys = this._state.value.map(_ => ++key)
  }
  getState() {
    return _.assign(super.getState(), _.pick(this, [
      'length'
    ]))
  }
  get length() {
    return this.values.length
  }
  at(index) {
    return this.values[index]
  }
  forEach(procedure) {
    this.values.forEach((value, index) => procedure(value, index, this))
  }
  map(transform) {
    return this.values.map((value, index) => {
      return transform(value, index, this, this.keys[index])
    })
  }
  insert(index, value) {
    this.keys = _.sliceIn(this.keys, index, ++key)
    this.fields = _.sliceIn(this.fields, index, void 0)
    this.form._patch(this.names, {
      value: _.sliceIn(this.values, index, value)
    })
  }
  push(value) {
    this.insert(this.values.length, value)
  }
  unshift(value) {
    this.insert(0, value)
  }
  remove(index) {
    this.keys = _.remove(this.keys, index)
    const { _state: { visits, touches } } = this.fields[index]
    this.fields = _.remove(this.fields, index)
    this.form._patch(this.names, {
      visits: -visits,
      touches: -touches,
      value: _.remove(this.values, index)
    })
  }
  clear() {
    this.keys = []
    this.form._patch(this.names, { value: [] })
    this.fields.slice().reverse().forEach(field => {
      this.form.unregister(field.names, field)
    })
  }
  pop() {
    this.remove(this.values.length - 1)
  }
  shift() {
    this.remove(0)
  }
  reset(options) {
    super.reset({ silent: true })
    this.initialize(this.init)
  }
  initialize(init) {
    this.fields
      .slice(init.length)
      .forEach(field => this.form.unregister(field.names, field))
    this.keys = this.keys.slice(0, init.length)
    init.forEach((_, index) => {
      this.keys[index] = this.keys[index] || ++key
    })
    super.initialize(init)
  }
  static create(form, init = [], route, config) {
    return super.create(form, init, route, config)
  }
}

export const View = class FieldArrayView extends FieldSet.View {
  get Model() {
    return Model
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
