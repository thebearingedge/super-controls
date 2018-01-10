import * as _ from './util'
import * as FieldSet from './field-set'

export const Model = class FieldArrayModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this._key = 0
    this.fields = []
    this._keys = this._state.value.map(_ => ++this._key)
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
      return transform(value, index, this, this._keys[index])
    })
  }
  insert(index, value) {
    this._keys = _.sliceIn(this._keys, index, ++this._key)
    this.fields = _.sliceIn(this.fields, index, void 0)
    this.form._patchField(this.names, {
      value: _.sliceIn(this.values, index, value)
    }, { validate: true })
  }
  push(value) {
    this.insert(this.values.length, value)
  }
  unshift(value) {
    this.insert(0, value)
  }
  remove(index) {
    this._keys = _.remove(this._keys, index)
    const { _state: { visits, touches } } = this.fields[index]
    this.fields = _.remove(this.fields, index)
    this.form._patchField(this.names, {
      visits: -visits,
      touches: -touches,
      value: _.remove(this.values, index)
    }, { validate: true })
  }
  clear() {
    this._keys = []
    this.form._patchField(this.names, { value: [] })
    this.fields.slice().reverse().forEach(field => {
      this.form._unregister(field.names, field)
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
      .reverse()
      .forEach(field => this.form._unregister(field.names, field, {
        silent: true
      }))
    this._keys = init.map((_, index) => this._keys[index] || ++this._key)
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
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: []
    }
  }
}
