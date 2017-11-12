import { createElement, PureComponent } from 'react'
import { func, string } from 'prop-types'

export default function field(Control) {

  return ({
    displayName,
    defaultProps = Control.defaultProps
  } = {}) => {

    const valueKey = 'value' in Control.defaultProps
      ? 'value'
      : 'checked'

    class Field extends PureComponent {
      constructor(...args) {
        super(...args)
        this.onChange = this.onChange.bind(this)
      }
      onChange({ target }) {
        this.context.setValue &&
        this.context.setValue({ [target.name]: target[valueKey] }, () => {
          this.forceUpdate()
        })
      }
      render() {
        const { onChange } = this
        const { getValue } = this.context
        const { name, ...props } = this.props
        const controlProps = {
          ...props,
          onChange,
          name
        }
        if (getValue) {
          controlProps[valueKey] = getValue(name)
        }
        return createElement(Control, { ...controlProps })
      }
    }

    Field.propTypes = {
      name: string.isRequired
    }

    Field.contextTypes = {
      setValue: func,
      getValue: func
    }

    Field.displayName = displayName

    return Field
  }
}
