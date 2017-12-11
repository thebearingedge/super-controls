import { createElement } from 'react'
import { oneOfType, any, bool, func, string, number } from 'prop-types'
import { pick, deepEqual, isBoolean, isString } from './util'
import * as SuperControl from './super-control'

export class Field extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onChange({ target: { type, value, checked } }) {
    this.model.update({
      value: type === 'checkbox' ? !!checked : value
    })
  }
  onBlur() {
    this.state.isTouched ||
    this.model.update({ isTouched: true })
  }
  getInit() {
    const { init, type } = this.props
    return type === 'checkbox' || isBoolean(init) ? !!init : init
  }
  getState(model) {
    return pick(model, ['init', 'value', 'isTouched', 'error', 'notice'])
  }
  modelField(...args) {
    return modelField(...args)
  }
  getFieldProp(model) {
    const state = this.getState(model)
    const extra = pick(model, ['update'])
    const isValid = !state.error
    const isInvalid = !isValid
    const isDirty = !deepEqual(state.init, state.value)
    const isPristine = !isDirty
    return {
      ...state,
      ...extra,
      isDirty,
      isValid,
      isInvalid,
      isPristine
    }
  }
  getControlProp({
    id, type, name, onBlur, onChange, propValue, fieldValue
  }) {
    const control = { type, name, onBlur, onChange }
    if (id) control.id = id === true ? name : id
    if (type === 'checkbox') {
      control.checked = !!fieldValue
      return control
    }
    if (type === 'radio') {
      control.value = propValue
      control.checked = propValue === fieldValue
      return control
    }
    control.value = fieldValue
    return control
  }
  render() {
    const {
      id,
      name,
      init,
      type,
      notify,
      validate,
      component,
      value: propValue,
      ...props
    } = this.props
    const { model, onBlur, onChange } = this
    const field = this.getFieldProp(model)
    const { value: fieldValue } = field
    const control = this.getControlProp({
      id, type, name, onBlur, onChange, propValue, fieldValue
    })
    if (isString(component)) {
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
      component: oneOfType([string, func]),
      id: oneOfType([number, string, bool])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: ''
    }
  }
}

export class FieldModel extends SuperControl.Model {
  get isTouched() {
    return this.form.getTouched(this.path, false)
  }
  update(state) {
    this.form.update(this.path, { validate: true, notify: true, ...state })
  }
}

export const modelField = (...args) => new FieldModel(...args)
