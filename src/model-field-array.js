import modelField from './model-field'
import {
  shallowEqual,
  someLeaves,
  mapLeaves,
  toPaths,
  fromPaths
} from './_util'

export default function modelFieldArray(form, paths) {
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
        return fromPaths(paths)
      }
    },
    mutations: {
      writable: true,
      value: 0
    },
    insert: {
      value(index, values) {
        const { form, path, fields, value: valueState } = this
        const fieldSet = mapLeaves(values, (value, keyPath) => {
          const fullPath = `${path}.${index}.${keyPath}`
          form.setInit(fullPath, value)
          return modelField(form, toPaths(fullPath))
        })
        const fieldSets = [
          ...fields.slice(0, index),
          fieldSet,
          ...fields.slice(index)
        ]
        const value = [
          ...valueState.slice(0, index),
          values,
          ...valueState.slice(index)
        ]
        const touched = form.getTouched(path) || []
        const isTouched = [
          ...touched.slice(0, index),
          mapLeaves(values, _ => false),
          ...touched.slice(index)
        ]
        form.setField(path, fieldSets)
        form.update(path, { value, isTouched })
        this.mutations++
      }
    },
    remove: {
      value(index) {
        const { form, path, fields, value: valueState } = this
        const fieldSets = [
          ...fields.slice(0, index),
          ...fields.slice(index + 1)
        ]
        const value = [
          ...valueState.slice(0, index),
          ...valueState.slice(index + 1)
        ]
        const touched = form.getTouched(path, [])
        const isTouched = [
          ...touched.slice(0, index),
          ...touched.slice(index + 1)
        ]
        form.setField(path, fieldSets)
        form.update(path, { value, isTouched })
        this.mutations++
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
