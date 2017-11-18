import { createElement, Component } from 'react'
import { func, string } from 'prop-types'
import { shallowEqual } from '../util'

export default function createControl(component) {

  return function configureControl({
    propTypes,
    displayName,
    defaultProps,
    valueKey = 'value'
  } = {}) {

    component.displayName = displayName ||
                            component.displayName ||
                            component.name

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = this.context.registerField({
          name: this.props.name,
          value: this.props[valueKey]
        })
        this.state = { ...this.field.state }
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
      }
      onChange({ target }) {
        this.field.update({ value: target[valueKey] })
      }
      onBlur() {
        this.field.state.isTouched ||
        this.field.update({ isTouched: true })
      }
      componentDidUpdate() {
        this.setState(this.field.state)
      }
      shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.field.state, nextState) ||
               !shallowEqual(this.props, nextProps)
      }
      render() {
        const { id: _id, name, ...ownProps } = this.props
        const { field, onBlur, onChange } = this
        const id = _id === true ? name : _id
        const props = {
          ...ownProps,
          field,
          control: {
            id,
            name,
            onBlur,
            onChange,
            [valueKey]: field.state.value
          }
        }
        return createElement(component, props)
      }
    }

    Control.propTypes = {
      ...propTypes,
      name: string.isRequired
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = defaultProps

    return Control
  }
}
