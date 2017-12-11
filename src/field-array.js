import { createElement } from 'react'
import { func, array } from 'prop-types'
import { FieldSet, FieldSetModel } from './field-set'
import * as _ from './util'

export class FieldArray extends FieldSet {
  modelField(...args) {
    return modelFieldArray(...args)
  }
  getFieldsProp(model) {
    const fields = super.getFieldsProp(model)
    const extra = _.pick(model, [
      'insert', 'remove', 'push', 'pop',
      'unshift', 'shift', 'map', 'length'
    ])
    return { ...fields, ...extra }
  }
  render() {
    const { component, children, ...props } = this.props
    return createElement(component || children, {
      ...props,
      fields: this.getFieldsProp(this.model)
    })
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: array,
      children: func,
      component: func
    }
  }
  static get defaultProps() {
    return {
      init: [],
      children: _ => null
    }
  }
}

class FieldArrayModel extends FieldSetModel {
  constructor(...args) {
    super(...args)
    this.fields = []
    this.insert = this.insert.bind(this)
    this.remove = this.remove.bind(this)
    this.push = this.push.bind(this)
    this.pop = this.pop.bind(this)
    this.unshift = this.unshift.bind(this)
    this.shift = this.shift.bind(this)
    this.map = this.map.bind(this)
  }
  get touched() {
    return this.form.getTouched(this.path, [])
  }
  get length() {
    return this.value.length
  }
  insert(index, newValue) {
    const { form, path, init, value, touched } = this
    form.update(path, {
      init: _.sliceIn(init, index, newValue),
      value: _.sliceIn(value, index, newValue),
      isTouched: _.set(touched, [index], void 0)
    })
  }
  remove(index) {
    const { form, path, init, value, touched } = this
    form.update(path, {
      init: _.sliceOut(init, index),
      value: _.sliceOut(value, index),
      isTouched: _.sliceOut(touched, index)
    })
  }
  push(newValue) {
    this.insert(this.length, newValue)
  }
  pop() {
    this.remove(this.length - 1)
  }
  unshift(newValue) {
    this.insert(0, newValue)
  }
  shift() {
    this.remove(0)
  }
  map(transform) {
    return this.value.map((value, index) =>
      transform(value, index, this)
    )
  }
}

export const modelFieldArray = (...args) => new FieldArrayModel(...args)
