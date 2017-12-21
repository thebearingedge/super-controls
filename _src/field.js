import * as SuperControl from './super-control'
import * as _ from './util'

export class Model extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.state.isTouched = false
    this.state.isVisited = false
  }
  get isFocused() {
    return this.form.state.focused === this
  }
  get prop() {
    return _.assign(super.prop, _.pick(this, ['isFocused']), {
      update: (state, options = { force: false }) => {
        const nextState = _.assign({}, state)
        if ('value' in state) {
          nextState.value = options.force
            ? state.value
            : this.override(state.value, this.form.values)
        }
        this.form.update(this.names, nextState, options)
      }
    })
  }
  update(names, state, options) {
    return this.setState(_.assign({}, this.state, state), options)
  }
}
