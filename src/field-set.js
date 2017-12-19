import { createElement } from 'react'
import { oneOfType, func, object, string } from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export class FieldSet extends SuperControl.View {
  constructor(...args) {
    super(...args)
    this.ownProps = _.omit(this.props, [
      'init', 'notify', 'validate', 'component'
    ])
  }
  getInit() {
    return this.props.init
  }
  modelField(...args) {
    return modelFieldSet(...args)
  }
  render() {
    const { props: { name, component }, ownProps: props } = this
    if (_.isString(component)) {
      return createElement(component, { ...props, name })
    }
    return createElement(component, {
      ...props,
      name,
      fields: this.model.toProp()
    })
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: object,
      component: oneOfType([string, func]).isRequired
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: {},
      component: 'fieldset'
    }
  }
}

export class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.checkAll = this.checkAll.bind(this)
  }
  get visited() {
    return this.form.getVisited(this.path, {})
  }
  get touched() {
    return this.form.getTouched(this.path, {})
  }
  get isTouched() {
    return _.someValues(this.touched, _.id)
  }
  toState() {
    return _.pick(this, [
      'init', 'value', 'touched', 'error', 'notice', 'visited'
    ])
  }
  toProp() {
    const name = this.path.pop()
    const state = this.toState()
    const { form, isTouched } = this
    const isValid = !state.error
    const isInvalid = !isValid
    const isDirty = !_.deepEqual(state.init, state.value)
    const isPristine = !isDirty
    return _.assign(state, {
      form, name, isValid, isInvalid, isDirty, isPristine, isTouched
    })
  }
  register(field, [ key, ...path ]) {
    this.fields = path.length
      ? _.set(this.fields, [key], this.fields[key].register(field, path))
      : _.set(this.fields, [key], field)
    return this
  }
  check(value, values, method, [ key, ...path ]) {
    return _.assign(
      super.check(_.set(this.value, [key, ...path], value), values, method),
      this.fields[key].check(value, values, method, path)
    )
  }
  checkAll(value, values, method) {
    return _.keys(this.fields)
      .reduce((checked, key) => {
        const { check, checkAll } = this.fields[key]
        return _.assign(
          checked,
          (checkAll || check)(values[key], values, method)
        )
      }, { [this.id]: this[`_${method}`](value, values) || null })
  }
}

export const modelFieldSet = (...args) => new FieldSetModel(...args)
