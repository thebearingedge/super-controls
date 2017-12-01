import { invoke, someLeaves } from './util'

export default function modelFieldSet(form, paths) {
  const model = {
    get fields() {
      return form.getField(this.path, {})
    },
    get init() {
      return form.getInit(this.path, {})
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return someLeaves(this.fields, ({ isTouched }) => isTouched)
    },
    get isDirty() {
      return someLeaves(this.fields, ({ isDirty }) => isDirty)
    },
    get isPristine() {
      return !this.isDirty
    }
  }
  return Object.defineProperties(model, {
    form: {
      value: form
    },
    path: {
      get: () => paths.map(invoke)
    },
    touches: {
      writable: true,
      value: 0
    },
    touch: {
      value: () => model.touches++
    }
  })
}
