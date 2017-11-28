import { someLeaves, fromThunks, createKey } from './util'

export default function modelFieldArray(form, paths) {

  const init = form.getValue(fromThunks(paths))

  const fieldArray = {
    get fields() {
      return form.getField(this.path, [])
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return this.value.length !== this.init.length ||
             someLeaves(this.fields, ({ isTouched }) => isTouched)
    },
    get isDirty() {
      return this.value.length !== this.init.length ||
             someLeaves(this.fields, ({ isDirty }) => isDirty)
    },
    get isPristine() {
      return !this.isDirty
    },
    get length() {
      return this.value.length
    }
  }
  return Object.defineProperties(fieldArray, {
    form: {
      value: form
    },
    path: {
      get() {
        return fromThunks(paths)
      }
    },
    init: {
      enumerable: true,
      value: init
    },
    keys: {
      writable: true,
      value: init.map(_ => createKey())
    },
    mutations: {
      writable: true,
      value: 0
    },
    insert: {
      value(index, values) {
        const { form, path, keys: oldKeys, value: oldValue } = this
        const oldInit = form.getInit(path)
        const oldTouched = form.getTouched(path, [])
        const [ value, init ] = [oldValue, oldInit].map(collection => [
          ...collection.slice(0, index),
          values,
          ...collection.slice(index)
        ])
        const isTouched = [
          ...oldTouched.slice(0, index),
          {},
          ...oldTouched.slice(index)
        ]
        this.keys = [
          ...oldKeys.slice(0, index),
          createKey(),
          ...oldKeys.slice(index)
        ]
        fieldArray.mutations++
        form.setInit(path, init)
        form.update(path, { value, isTouched })
      }
    },
    remove: {
      value(index) {
        const { form, path, keys: oldKeys, value: oldValue } = this
        const oldInit = form.getInit(path)
        const oldTouched = form.getTouched(path)
        const [ init, keys, value, isTouched ] = [
          oldInit,
          oldKeys,
          oldValue,
          oldTouched
        ].map(collection => [
          ...collection.slice(0, index),
          ...collection.slice(index + 1)
        ])
        fieldArray.mutations++
        this.keys = keys
        form.setInit(path, init)
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
    },
    map: {
      value(transform) {
        return this.value.map((values, i) =>
          transform(values, i, this.keys[i])
        )
      }
    }
  })
}
