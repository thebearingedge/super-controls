import { invoke } from './util'

export default function modelField(form, init, paths) {
  const model = {
    get init() {
      return form.getInit(this.path, init)
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return !!form.getTouched(this.path)
    },
    get isDirty() {
      return this.value !== this.init
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
    update: {
      writable: true,
      value: state => form.update(model.path, state)
    }
  })
}
