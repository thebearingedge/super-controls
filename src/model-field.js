import { fromPaths } from './_util'

export default function modelField(form, init, paths) {
  const field = {
    get init() {
      return init
    },
    get value() {
      return form.getValue(this.path, init)
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
    paths: {
      value: paths
    },
    path: {
      get() {
        return fromPaths(this.paths)
      }
    },
    update: {
      value(state) {
        form.update(this.path, state)
      }
    }
  })
}
