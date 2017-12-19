import { createElement } from 'react'
import { oneOfType, any, bool, func, string, number } from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export class Field extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.ownProps = _.omit(this.props, [
      'id', 'name', 'init', 'type', 'value', 'parse',
      'format', 'override', 'notify', 'validate', 'component'
    ])
  }
  onChange(event) {
    const {
      getValue,
      props: { parse, override },
      model: { form: { values }, update }
    } = this
    const value = override(parse(getValue(event)), values)
    update({ value })
  }
  onBlur(event) {
    const {
      getValue,
      props: { parse },
      model: { update }
    } = this
    const value = parse(getValue(event))
    update({ value, isTouched: true, isFocused: null })
  }
  onFocus() {
    this.model.update({ isFocused: this.model })
  }
  getValue({ target: { type, value, checked } }) {
    return type === 'checkbox' ? !!checked : value
  }
  getInit() {
    const { init, type, parse } = this.props
    if (_.isBoolean(init)) return init
    if (type === 'checkbox') return !!init
    return init || parse(init)
  }
  modelField(...args) {
    return modelField(...args)
  }
  modelControl({ value: fieldValue }) {
    const { id, type, name, format, value: propsValue } = this.props
    const { onBlur, onFocus, onChange } = this
    const control = { type, name, onBlur, onFocus, onChange }
    if (id) control.id = id === true ? name : id
    if (type === 'checkbox') {
      return _.assign(control, { checked: !!fieldValue })
    }
    if (type === 'radio') {
      return _.assign(control, {
        value: propsValue,
        checked: propsValue === fieldValue
      })
    }
    return _.assign(control, { value: format(fieldValue) })
  }
  render() {
    const { props: { component }, model: { value }, ownProps: props } = this
    const control = this.modelControl({ value })
    if (_.isString(component)) {
      return createElement(component, { ...control, ...props })
    }
    const field = this.model.toProp()
    return createElement(component, { field, control, ...props })
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: any,
      value: any,
      type: string,
      parse: func,
      format: func,
      override: func,
      component: oneOfType([string, func]),
      id: oneOfType([number, string, bool])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: '',
      parse: _.id,
      format: _.id,
      override: _.id
    }
  }
}

export class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.update = this.update.bind(this)
  }
  get isFocused() {
    return this.form.getFocused() === this
  }
  get isVisited() {
    return this.form.getVisited(this.path, false)
  }
  get isTouched() {
    return this.form.getTouched(this.path, false)
  }
  update(state, { notify = true, validate = true } = {}) {
    this.form.update(this.path, state, { notify, validate })
  }
  toState() {
    return _.pick(this, [
      'init', 'value', 'error', 'notice',
      'isFocused', 'isVisited', 'isTouched'
    ])
  }
  toProp() {
    const name = this.path.pop()
    const state = this.toState()
    const { form, update } = this
    const isValid = !state.error
    const isInvalid = !isValid
    const isPristine = _.deepEqual(state.init, state.value)
    const isDirty = !isPristine
    return _.assign(state, {
      form, name, update, isValid, isInvalid, isDirty, isPristine
    })
  }
}

export const modelField = (...args) => new FieldModel(...args)
