import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.reset = this.reset.bind(this)
    this.visit = this.visit.bind(this)
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
  }
  update(change, options = {}) {
    const next = _.assign({}, change)
    if ('value' in change && !options.force) {
      next.value = this.override(change.value, this.root.values)
    }
    this.root.patch(this.names, next, options)
  }
  getState() {
    const { init, value, ...state } = super.getState()
    const isPristine = _.shallowEqual(value, init)
    const isDirty = !isPristine
    return { init, value, isPristine, isDirty, ...state }
  }
  visit(options) {
    this.update({ visits: 1 }, options)
  }
  touch(options) {
    this.update({ touches: 1 }, options)
  }
  change(value, options) {
    this.update({ value }, options)
  }
  untouch(options) {
    this.update({ touches: -this.state.touches }, options)
  }
  reset(options) {
    const { init, visits, touches } = this.state
    const change = { value: init, visits: -visits, touches: -touches }
    this.update(change, options)
  }
}

export class View extends SuperControl.View {
  get init() {
    const { init, parse } = this.props
    if (this.isCheckbox) return parse(!!init)
    if (this.isMultipleSelect) return parse(init || [])
    return parse(init)
  }
  get Model() {
    return Model
  }
  get config() {
    return _.pick(this.props, ['notify', 'validate', 'override'])
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
  get prop() {
    return _.assign(super.prop, _.pick(this.model, [
      'visit', 'touch', 'change', 'untouch', 'reset'
    ]))
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
      field.touch({ validate: true, notify: true })
    }
  }
  handleFocus(field) {
    return event => {
      const wrapped = _.wrapEvent(event)
      this.props.onFocus(wrapped, field)
      if (wrapped.defaultPrevented) return
      field.visit()
    }
  }
  handleChange(field) {
    return event => {
      const value = this.getValue(event)
      const wrapped = _.wrapEvent(event)
      this.props.onChange(wrapped, value, field)
      if (wrapped.defaultPrevented) return
      field.change(value, { validate: true, notify: true, quiet: true })
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
      override: PropTypes.func.isRequired
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
