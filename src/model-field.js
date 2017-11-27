import { fromPaths } from './_util'

export default function modelField(form, paths) {
  const field = {
    get init() {
      return form.getInit(this.path)
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
  return Object.defineProperties(field, {
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
    },
    update: {
      configurable: true,
      value(state) {
        form.update(field.path, state)
        field.mutations++
      }
    }
  })
}
