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
  }
  onChange(event) {
    const { getValue, props: { parse }, model: { update } } = this
    const value = parse(getValue(event))
    update({ value }, { notify: true, validate: true })
  }
  onBlur(event) {
    const { getValue, props: { parse }, model: { update } } = this
    const value = parse(getValue(event))
    update({
      value,
      isTouched: true,
      isFocused: null
    }, {
      notify: true,
      validate: true
    })
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
  getFieldProp(model) {
    const name = this.props.name
    const state = model.toState()
    const extra = _.pick(model, ['form', 'update'])
    const isValid = !state.error
    const isInvalid = !isValid
    const isDirty = !_.deepEqual(state.init, state.value)
    const isPristine = !isDirty
    return {
      ...state, ...extra, name, isDirty, isValid, isInvalid, isPristine
    }
  }
  getControlProp({ fieldValue }) {
    const { id, type, name, format } = this.props
    const { onBlur, onFocus, onChange } = this
    const control = { type, name, onBlur, onFocus, onChange }
    if (id) {
      control.id = id === true ? name : id
    }
    if (type === 'checkbox') {
      control.checked = !!fieldValue
      return control
    }
    if (type === 'radio') {
      control.value = this.props.value
      control.checked = this.props.value === fieldValue
      return control
    }
    control.value = format(fieldValue)
    return control
  }
  render() {
    const { component, ...props } = _.omit(this.props, [
      'id', 'name', 'init', 'type', 'parse',
      'format', 'notify', 'validate', 'value'
    ])
    const field = this.getFieldProp(this.model)
    const { value: fieldValue } = field
    const control = this.getControlProp({ fieldValue })
    if (_.isString(component)) {
      return createElement(component, { ...control, ...props })
    }
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
      component: oneOfType([string, func]),
      id: oneOfType([number, string, bool])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: '',
      parse: _.id,
      format: _.id
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
  update(state, options) {
    this.form.update(this.path, state, options)
  }
  toState() {
    return _.pick(this, [
      'init', 'value', 'error', 'notice',
      'isFocused', 'isVisited', 'isTouched'
    ])
  }
}

export const modelField = (...args) => new FieldModel(...args)
