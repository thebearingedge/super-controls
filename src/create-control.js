import { createElement, Component } from 'react'
import { func, string } from 'prop-types'
import shallowEqual from 'shallow-equal/objects'

export default function createControl(component) {

  return function configureControl({
    __valueKey__ = 'value',
    propTypes,
    defaultProps,
    displayName = component.displayName
  } = {}) {

    component.displayName = displayName

    class Control extends Component {
      constructor(...args) {
        super(...args)
        this.field = null
        this.state = { value: this.props[__valueKey__] }
        this.onChange = this.onChange.bind(this)
        this.setValue = this.setValue.bind(this)
      }
      onChange({ target }) {
        this.setValue(target[__valueKey__])
      }
      setValue(value) {
        this.field.setValue(value)
        this.setState({ value })
      }
      componentWillMount() {
        const { name } = this.props
        this.field = this.context.registerField({ name })
        const stateValue = this.field.state.value === void 0
          ? this.state.value
          : this.field.state.value
        this.setState({ value: stateValue })
        this.field.setValue(stateValue)
      }
      shouldComponentUpdate(nextProps, nextState) {
        const { props, state, field } = this
        return !shallowEqual(state, field.state) ||
               !shallowEqual(props, nextProps) ||
               !shallowEqual(state, nextState)
      }
      render() {
        const { onChange } = this
        const { name, ...props } = this.props
        const { value } = this.state
        const id = this.props.id === true
          ? name
          : this.props.id
        const controlProps = {
          ...props,
          id,
          name,
          onChange,
          [__valueKey__]: value
        }
        const { setValue } = this
        const field = { setValue }
        return createElement(component, { ...controlProps, field })
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
      ...defaultProps
    }

    return Control
  }
}
