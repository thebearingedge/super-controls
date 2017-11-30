import {
  invoke,
  insert,
  sliceOut,
  createKey,
  someLeaves
} from './util'

export default function modelFieldArray(form, paths) {

  const init = form.getInit(paths.map(invoke), [])

  const model = {
    get fields() {
      return form.getField(this.path, [])
    },
    get init() {
      return form.getInit(this.path, [])
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return this.value.length !== this.init.length ||
             someLeaves(this.fields, ({ isTouched }) => isTouched)
    },
    get isDirty() {
      return someLeaves(this.fields, ({ isDirty }) => isDirty)
    },
    get isPristine() {
      return !this.isDirty
    },
    get length() {
      return this.value.length
    }
  }
  return Object.defineProperties(model, {
    form: {
      value: form
    },
    path: {
      get: () => paths.map(invoke)
    },
    keys: {
      writable: true,
      value: init.map(_ => createKey())
    },
    touches: {
      writable: true,
      value: 0
    },
    touch: {
      value: () => model.touches++
    },
    insert: {
      value: (index, values) => {
        const { init, path, keys, value } = model
        model.keys = insert(keys, index, createKey())
        form.update(path, {
          init: insert(init, index, values),
          value: insert(value, index, values)
        })
      }
    },
    remove: {
      value: index => {
        const { init, path, keys, value } = model
        model.keys = sliceOut(keys, index)
        form.update(path, {
          init: sliceOut(init, index),
          value: sliceOut(value, index)
        })
      }
    },
    push: {
      value: values => model.insert(model.length, values)
    },
    pop: {
      value: () => model.remove(model.length - 1)
    },
    unshift: {
      value: values => model.insert(0, values)
    },
    shift: {
      value: () => model.remove(0)
    },
    map: {
      value: fn => model.value.map((values, i) =>
        fn(values, i, model.keys[i])
      )
    }
  })
}
