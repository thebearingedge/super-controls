import * as FieldSet from './field-set'
import * as _ from './util'

export const Model = class FormModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.root = this
    this.focused = null
  }
  register({ init, route, config, Model }) {
    const names = route.map(_.invoke)
    const registered = this.getField(names)
    if (registered) return registered
    const value = _.get(this.state.init, names, init)
    const field = Model.create(this, value, route, config)
    super.register(names, field)
    return field
  }
  patch(names, state, options) {
    if ('isFocused' in state) this.focused = state.isFocused
    return super.patch(names, state, options)
  }
  static get create() {
    return (name, init, checks) =>
      super.create(null, init, [_.wrap(name)], checks)
  }
}

export class View extends FieldSet.View {

}
