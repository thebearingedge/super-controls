import shallowEqual from 'shallow-equal/objects'
import createControl from '../create-control'
import { bool, string } from 'prop-types'

export default class Radio extends createControl('radio')() {
  componentDidUpdate() {
    !shallowEqual(this.field.state, this.state) &&
    this.setState(this.field.state)
  }
}

Radio.propTypes = {
  checked: bool,
  value: string.isRequired
}

Radio.defaultProps = {
  checked: false
}
