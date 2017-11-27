import { someLeaves, fromPaths } from './_util'

export default function modelFieldSet(form, init, paths) {
  const fieldSet = {
    get fields() {
      return form.getField(this.path, {})
    },
    get init() {
      return init
    },
    get value() {
      return form.getValue(this.path, init)
    },
    get isTouched() {
      return someLeaves(this.fields, ({ isTouched }) => isTouched)
    },
    get isDirty() {
      return this.value !== this.init
    },
    get isPristine() {
      return !this.isDirty
    }
  }
  return Object.defineProperties(fieldSet, {
    form: {
      value: form
    },
    paths: {
      value: paths
    },
    path: {
      get() {
        return fromPaths(this.paths)
      }
    },
    mutations: {
      configurable: true,
      value: 0
    }
  })
}
