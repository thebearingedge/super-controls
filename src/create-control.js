import { createElement, Component } from 'react'
import { func, string } from 'prop-types'
import { pipe, noop, shallowEqual } from './util'

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
        this.onChange = pipe(this.onChange.bind(this), this.props.onChange)
      }
      onChange(event) {
        const value = event.target[targetKey]
        this.setState({ value })
        this.field.setValue(value)
        return event
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
        const { field, onChange } = this
        const { value } = field.state
        const { name, ...ownProps } = this.props
        const id = this.props.id === true
          ? name
          : this.props.id
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
