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
    return this.root.state.focused === this
  }
  update(state, options = { force: false }) {
    const nextState = _.assign({}, state)
    if ('value' in state && !options.force) {
      nextState.value = this.override(state.value, this.root.values)
    }
    this.root.patch(this.names, nextState, options)
  }
}

export class View extends SuperControl.View {
  get Model() {
    return Model
  }
  get isCheckbox() {
    return this.props.component === 'input' &&
           this.props.type === 'checkbox'
  }
  get isRadio() {
    return this.props.component === 'input' &&
           this.props.type === 'radio'
  }
  get init() {
    const { init, parse } = this.props
    if (_.isBoolean(init)) return init
    if (this.isCheckbox) return !!init
    return init || parse(init)
  }
  get prop() {
    const { state: { value, init }, model } = this
    const isPristine = _.shallowEqual(value, init)
    const isDirty = !isPristine
    return _.assign(super.prop, _.pick(model, ['isFocused', 'update']), {
      isDirty,
      isPristine
    })
  }
  get control() {
    const { id, type, name, format } = this.props
    const { onBlur, onFocus, onChange } = this
    const control = { type, name, onBlur, onFocus, onChange }
    if (id) control.id = id === true ? name : id
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
  onChange(event) {
  }
  onBlur(event) {
  }
  onFocus(event) {
  }
  render() {
    if (_.isString(this.props.component)) {
      return super.render(this.control)
    }
    return super.render({
      field: this.prop,
      control: this.control
    })
  }
  static get displayName() {
    return 'Field'
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      type: PropTypes.string,
      value: PropTypes.string,
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
      override: _.id
    }
  }
}
