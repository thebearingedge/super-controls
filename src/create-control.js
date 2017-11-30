import { createElement, Component } from 'react'
import { func, string, number, oneOfType } from 'prop-types'
import { isUndefined, equalProps, omit } from './util'

export default function createControl(component) {

  return function configureControl({
    propTypes,
    displayName,
    defaultProps,
    valueKey = 'value',
    injectField = false
  } = {}) {

    component.displayName = displayName ||
                            component.displayName ||
                            component.name

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.model = this.context.registerField({
          paths: [() => this.props.name],
          value: this.props[valueKey]
        })
        this.state = {
          value: this.model.value,
          isTouched: this.model.isTouched
        }
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
      }
      onChange({ target }) {
        this.model.update({ value: target[valueKey] })
      }
      onBlur() {
        this.model.isTouched ||
        this.model.update({ isTouched: true })
      }
      shouldComponentUpdate(nextProps, nextState) {
        return !equalProps(this.props, nextProps) ||
               nextState.value !== this.model.value ||
               nextState.isTouched !== this.model.isTouched
      }
      componentDidUpdate() {
        this.setState({
          value: this.model.value,
          isTouched: this.model.isTouched
        })
      }
      render() {
        const { id, name, ...props } = this.props
        const { model, onBlur, onChange } = this
        const control = {
          name,
          onBlur,
          onChange,
          [valueKey]: model.value
        }
        if (!isUndefined(id)) control.id = id === true ? name : id
        const componentProps = {
          ...omit(props, [valueKey]),
          control
        }
        if (injectField) componentProps.field = model
        return createElement(component, componentProps)
      }
    }

    Control.propTypes = {
      ...propTypes,
      name: oneOfType([string, number]).isRequired
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = defaultProps

    return Control
  }
}
