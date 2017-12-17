import { createElement } from 'react'
import { oneOfType, any, bool, func, string, number } from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

const getValue = ({ target: { type, value, checked } }) =>
  type === 'checkbox' ? !!checked : value

export class Field extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onChange(event) {
    this.model.update({
      value: getValue(event)
    }, {
      notify: true,
      validate: true
    })
  }
  onBlur(event) {
    this.model.update({
      isTouched: true,
      isFocused: null,
      value: getValue(event)
    }, {
      notify: true,
      validate: true
    })
  }
  onFocus() {
    this.model.update({ isFocused: this.model })
  }
  getInit() {
    const { init, type } = this.props
    return type === 'checkbox' || _.isBoolean(init) ? !!init : init
  }
  modelField(...args) {
    return modelField(...args)
  }
  getFieldProp(model) {
    const name = this.props.name
    const state = model.getState()
    const extra = _.pick(model, ['form', 'update'])
    const isValid = !state.error
    const isInvalid = !isValid
    const isDirty = !_.deepEqual(state.init, state.value)
    const isPristine = !isDirty
    return {
      ...state, ...extra, name, isDirty, isValid, isInvalid, isPristine
    }
  }
  getControlProp({
    id, type, name, onBlur, onFocus, onChange, propValue, fieldValue
  }) {
    const control = { type, name, onBlur, onFocus, onChange }
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
    const { model, onBlur, onFocus, onChange } = this
    const field = this.getFieldProp(model)
    const { value: fieldValue } = field
    const control = this.getControlProp({
      id, type, name, onBlur, onFocus, onChange, propValue, fieldValue
    })
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
  getState() {
    return _.pick(this, [
      'init', 'value', 'error', 'notice',
      'isFocused', 'isVisited', 'isTouched'
    ])
  }
}

export const modelField = (...args) => new FieldModel(...args)
