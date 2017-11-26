export default function modelField(form, init, path) {
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
    path: {
      value: path
    },
    update: {
      value(state) {
        form.update(this.path, state)
      }
    }
  })
}
