import PropTypes from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.update = this.update.bind(this)
    this.visit = this.visit.bind(this)
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
  }
  update(state, { force = false, ...options } = {}) {
    const nextState = _.assign({}, state)
    if ('value' in state && !force) {
      nextState.value = this.override(state.value, this.root.values)
    }
    this.root.patch(this.names, nextState, options)
  }
  visit() {
    this.update({ visits: 1 })
  }
  touch() {
    this.update({ touches: 1 })
  }
  change(value) {
    this.update({ value })
  }
  untouch() {
    this.update({ touches: -this.state.touches })
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
    const isPristine = _.shallowEqual(this.state.value, this.state.init)
    const isDirty = !isPristine
    return _.assign(super.prop, _.pick(this.model, [
      'visit', 'touch', 'change', 'untouch'
    ]), _.pick(this.state, [
      'isVisited', 'isTouched'
    ]), {
      isDirty, isPristine
    })
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
      field.touch()
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
      field.change(value)
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
