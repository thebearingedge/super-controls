import * as FieldSet from './field-set'
import * as _ from './util'

export class Model extends FieldSet.Model {
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
    return this.state.value.length
  }
  get prop() {
    const array = _.pick(this, [
      'at', 'length',
      'insert', 'push', 'unshift',
      'remove', 'pop', 'shift', 'clear'
    ])
    return _.assign(super.prop, array, {
      forEach: function (iteratee) {
        this.values.forEach((value, index) => iteratee(value, index, this))
      },
      map: function (transform) {
        return this.values.map((value, index) => transform(value, index, this))
      }
    })
  }
  at(index) {
    return this.state.value[index]
  }
  insert(index, value) {
    this.form.update(this.names, {
      init: _.sliceIn(this.state.value, index, value),
      value: _.sliceIn(this.state.value, index, value),
      touched: _.sliceIn(this.state.touched, index),
      visited: _.sliceIn(this.state.visited, index)
    })
  }
  push(value) {
    this.insert(this.state.value.length, value)
  }
  unshift(value) {
    this.insert(0, value)
  }
  remove(index) {
    this.form.update(this.names, {
      init: _.sliceOut(this.state.value, index),
      value: _.sliceOut(this.state.value, index),
      touched: _.sliceOut(this.state.touched, index),
      visited: _.sliceOut(this.state.visited, index)
    })
  }
  clear() {
    this.form.update(this.names, {
      init: [],
      value: [],
      touched: [],
      visited: []
    })
  }
  pop() {
    this.remove(this.state.value.length - 1)
  }
  shift() {
    this.remove(0)
  }
}
