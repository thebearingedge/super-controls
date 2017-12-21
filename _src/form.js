import * as FieldSet from './field-set'
import * as _ from './util'

export class Model extends FieldSet.Model {
  constructor(...args) {
    super(...args)
    this.form = this
    this.touch = this.touch.bind(this)
    this.change = this.change.bind(this)
    this.untouch = this.untouch.bind(this)
  }
  register(init, route, createModel) {
    const names = route.map(_.invoke)
    const registered = this.getField(names)
    if (registered) return registered
    const value = _.get(this.state.init, names, init)
    const field = createModel(this, value, route)
    super.register(names, field)
    return field
  }
  change(path, value) {
    const names = _.fromPath(path)
    const field = this.getField(names)
    field && this.update(names, { value })
  }
  touch(path) {
    const names = _.fromPath(path)
    const field = this.getField(names)
    field && this.update(field.names, { isTouched: true })
  }
  untouch(path) {
    const names = _.fromPath(path)
    const field = this.getField(names)
    field && this.update(field.names, { isTouched: false })
  }
  get prop() {
    return _.assign(_.omit(super.prop, ['path', 'names']), _.pick(this, [
      'touch', 'change', 'untouch'
    ]))
  }
  static get create() {
    return (name, init, checks) => new this(null, init, [_ => name], checks)
  }
}
