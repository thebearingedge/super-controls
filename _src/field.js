import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.state.isTouched = false
    this.state.isVisited = false
    this.update = this.update.bind(this)
  }
  get isFocused() {
    return !!this.root &&
           this.root.focused === this
  }
  getState() {
    return _.assign({}, this.state, _.pick(this, ['isFocused']))
  }
  update(state, { validate = true, notify = true, force = false } = {}) {
    const nextState = _.assign({}, state)
    if ('value' in state && !force) {
      nextState.value = this.override(state.value, this.root.values)
    }
    this.root.patch(this.names, nextState, { validate, notify })
  }
}

export class View extends SuperControl.View {
  get Model() {
    return Model
  }
  get isCheckbox() {
    return this.props.type === 'checkbox'
  }
  get isRadio() {
    return this.props.type === 'radio'
  }
  get isMultipleSelect() {
    return this.props.component === 'select' &&
           !!this.props.multiple
  }
  get init() {
    const { init, parse } = this.props
    if (this.isCheckbox) return parse(!!init)
    if (this.isMultipleSelect) return parse(init || [])
    return parse(init)
  }
  get config() {
    return _.pick(this.props, ['notify', 'validate', 'override'])
  }
  get prop() {
    const { state: { value, init }, model: { isFocused, update } } = this
    const isPristine = _.shallowEqual(value, init)
    const isDirty = !isPristine
    return _.assign(super.prop, { update, isDirty, isFocused, isPristine })
  }
  createControl(field) {
    const { type, name, format } = this.props
    const control = {
      name,
      onBlur: this.handleBlur(field),
      onFocus: this.handleFocus(field),
      onChange: this.handleChange(field)
    }
    if (type) control.type = type
    if (this.isCheckbox) {
      return _.assign(control, {
        checked: !!this.state.value
      })
    }
    if (this.isRadio) {
      return _.assign(control, {
        value: this.props.value,
        checked: this.props.value === this.state.value
      })
    }
    return _.assign(control, { value: format(this.state.value) })
  }
  getValue({ target: { value, checked, options = [] } }) {
    if (this.isCheckbox) {
      return this.props.parse(!!checked)
    }
    if (this.isMultipleSelect) {
      return this.props.parse(
        Array.from(options)
          .filter(option => option.selected)
          .map(option => option.value)
      )
    }
    return this.props.parse(value)
  }
  handleBlur(field) {
    return event => {
      const wrapped = _.wrapEvent(event)
      this.props.onBlur(wrapped, field)
      if (wrapped.defaultPrevented) return
      field.update({ isTouched: true, isFocused: null })
    }
  }
  handleFocus(field) {
    return event => {
      const wrapped = _.wrapEvent(event)
      this.props.onFocus(wrapped, field)
      if (wrapped.defaultPrevented) return
      field.update({ isFocused: this.model, isVisited: true })
    }
  }
  handleChange(field) {
    return event => {
      const value = this.getValue(event)
      const wrapped = _.wrapEvent(event)
      this.props.onChange(wrapped, value, field)
      if (wrapped.defaultPrevented) return
      field.update({ value })
    }
  }
  render() {
    if (_.isString(this.props.component)) {
      return super.render(this.createControl(this.prop))
    }
    const field = this.prop
    const control = this.createControl(field)
    return super.render({ field, control })
  }
  static get displayName() {
    return 'Field'
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      type: PropTypes.string,
      value: PropTypes.string,
      multiple: PropTypes.bool,
      parse: PropTypes.func.isRequired,
      format: PropTypes.func.isRequired,
      override: PropTypes.func.isRequired,
      id: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string, PropTypes.bool
      ])
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: '',
      parse: _.id,
      format: _.id,
      override: _.id,
      onBlur: _.noop,
      onFocus: _.noop,
      onChange: _.noop
    }
  }
}
