import * as _ from './util'
import * as SuperControl from './super-control'

export const Model = class FieldModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.touch = this.touch.bind(this)
    this.untouch = this.untouch.bind(this)
  }
  visit(options) {
    this.form._patchField(this.names, { visits: 1 }, options)
  }
  touch(options) {
    this.form._patchField(this.names, { touches: 1 }, options)
  }
  change(next, options = {}) {
    const { form, names, config } = this
    const value = options.force
      ? next
      : config.override(next, form.values)
    form._patchField(names, { value }, options)
  }
  untouch(options) {
    const { form, names, _state: { touches } } = this
    form._patchField(names, { touches: -touches }, options)
  }
}

export const View = class FieldView extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
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
  get control() {
    const { type, name, format } = this.props
    const control = {
      name,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      onChange: this.handleChange
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
  handleBlur(event) {
    const wrapped = _.wrapEvent(event)
    this.props.onBlur(wrapped, this.model)
    if (wrapped.defaultPrevented) return
    this.model.touch({ validate: true, activate: true })
  }
  handleFocus(event) {
    const wrapped = _.wrapEvent(event)
    this.props.onFocus(wrapped, this.model)
    if (wrapped.defaultPrevented) return
    this.model.visit({ activate: true })
  }
  handleChange(event) {
    const value = this.getValue(event)
    const wrapped = _.wrapEvent(event)
    this.props.onChange(wrapped, value, this.model)
    if (wrapped.defaultPrevented) return
    this.model.change(value, { validate: true, quiet: true })
  }
  render() {
    const { control, props: { component } } = this
    if (_.isString(component)) return super.render(control)
    return super.render({ field: this.model, control })
  }
  static get displayName() {
    return 'Field'
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
