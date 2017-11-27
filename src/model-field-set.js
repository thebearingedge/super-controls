import { someLeaves, fromPaths, shallowEqual } from './_util'

export default function modelFieldSet(form, paths) {
  const fieldSet = {
    get fields() {
      return form.getField(this.path, {})
    },
    get init() {
      return form.getInit(this.path)
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return someLeaves(this.fields, ({ isTouched }) => isTouched)
    },
    get isDirty() {
      return !shallowEqual(this.value, this.init)
    },
    get isPristine() {
      return !this.isDirty
    }
  }
  return Object.defineProperties(fieldSet, {
    form: {
      value: form
    },
    path: {
      get() {
        return fromPaths(paths)
      }
    },
    mutations: {
      configurable: true,
      value: 0
    }
  })
}
