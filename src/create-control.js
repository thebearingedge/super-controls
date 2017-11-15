import { createElement, Component } from 'react'
import { func, string } from 'prop-types'
import { pipe, pick, noop, shallowEqual } from './util'

export default function createControl(component) {

  return function configureControl({
    targetKey = 'value',
    propTypes,
    displayName,
    defaultProps
  } = {}) {

    component.displayName = displayName ||
                            component.displayName ||
                            component.name

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = this.context.registerField({
          name: this.props.name,
          value: this.props[targetKey]
        })
        this.state = { ...this.field.state }
        this.setValue = this.setValue.bind(this)
        this.onChange = pipe(this.onChange.bind(this), this.props.onChange)
      }
      onChange(event) {
        event && this.setValue(event.target[targetKey])
      }
      setValue(value) {
        this.field.setValue(value)
      }
      componentDidUpdate() {
        !shallowEqual(this.state, this.field.state) &&
        this.setState(this.field.state)
      }
      shouldComponentUpdate(nextProps, nextState) {
        const { props, state, field } = this
        return !shallowEqual(state, field.state) ||
               !shallowEqual(props, nextProps) ||
               !shallowEqual(state, nextState)
      }
      render() {
        const { onChange } = this
        const { value } = this.field.state
        const { name, ...ownProps } = this.props
        const id = this.props.id === true
          ? name
          : this.props.id
        const field = pick(this.field, ['setValue'])
        const props = {
          ...ownProps,
          id,
          name,
          field,
          onChange,
          [targetKey]: value
        }
        return createElement(component, props)
      }
    }

    Control.propTypes = {
      name: string.isRequired,
      ...propTypes
    }

    Control.contextTypes = {
      registerField: func.isRequired
    }

    Control.defaultProps = {
      ...component.defaultProps,
      ...defaultProps,
      onChange: noop
    }

    return Control
  }
}
