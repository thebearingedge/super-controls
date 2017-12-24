import * as FieldSet from './field-set'
import * as _ from './util'

export const Model = class FormModel extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.root = this
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
  static get create() {
    return (name, init, checks) =>
      super.create(null, init, [_.wrap(name)], checks)
  }
}

export class View extends FieldSet.View {

}
