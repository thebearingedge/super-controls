import { someLeaves } from './_util'

export default function modelFieldSet(form, init, path) {
  const fieldSet = {
    get fields() {
      return form.getField(path, {})
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
    path: {
      value: path
    }
  })
}
