import { createElement } from 'react'
import { oneOfType, func, object, string } from 'prop-types'
import { id, pick, isString, someValues } from './util'
import * as SuperControl from './super-control'

export class FieldSet extends SuperControl.View {
  getInit() {
    return this.props.init
  }
  getState() {
    return pick(this.model, ['init', 'value', 'touched'])
  }
  modelField(form, init, paths) {
    return modelFieldSet(form, init, paths)
  }
  render() {
    const { init, notify, validate, component, ...props } = this.props
    if (isString(component)) return createElement(component, props)
    return createElement(component, {
      ...props,
      fields: this.model
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
  get touched() {
    return this.form.getTouched(this.path, {})
  }
  get isTouched() {
    return someValues(this.touched, id)
  }
}

export const modelFieldSet = (...args) => new FieldSetModel(...args)
