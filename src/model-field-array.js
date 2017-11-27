import { shallowEqual, someLeaves, mapProperties, fromThunks } from './_util'

export default function modelFieldArray(form, thunks) {
  const fieldArray = {
    get fields() {
      return form.getField(this.path, [])
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
    },
    get length() {
      return this.fields.length
    }
  }
  return Object.defineProperties(fieldArray, {
    form: {
      value: form
    },
    path: {
      get() {
        return fromThunks(thunks)
      }
    },
    mutations: {
      writable: true,
      value: 0
    },
    insert: {
      value(index, values) {
        const { form, path, value: valueState } = this
        mapProperties(values, (value, keyPath) => {
          form.setInit([...path, index, ...keyPath], value)
        })
        const value = [
          ...valueState.slice(0, index),
          values,
          ...valueState.slice(index)
        ]
        const touched = form.getTouched(path) || []
        const isTouched = [
          ...touched.slice(0, index),
          mapProperties(values, _ => false),
          ...touched.slice(index)
        ]
        fieldArray.mutations++
        form.update(path, { value, isTouched })
      }
    },
    remove: {
      value(index) {
        const { form, path, value: valueState } = this
        const value = [
          ...valueState.slice(0, index),
          ...valueState.slice(index + 1)
        ]
        const touched = form.getTouched(path, [])
        const isTouched = [
          ...touched.slice(0, index),
          ...touched.slice(index + 1)
        ]
        fieldArray.mutations++
        form.update(path, { value, isTouched })
      }
    },
    push: {
      value(values) {
        this.insert(this.length, values)
      }
    },
    pop: {
      value() {
        this.remove(this.length - 1)
      }
    },
    unshift: {
      value(values) {
        this.insert(0, values)
      }
    },
    shift: {
      value() {
        this.remove(0)
      }
    }
  })
}
