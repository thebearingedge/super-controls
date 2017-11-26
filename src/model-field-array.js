import modelField from './model-field'
import { someLeaves, mapLeaves } from './_util'

export default function modelFieldArray(form, init, path) {
  const fieldArray = {
    get fields() {
      return form.getField(this.path, [])
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
      value: path
    },
    insert: {
      value(index, values) {
        const { form, path, value: valueState, fields } = this
        const fieldSet = mapLeaves(values, (init, keyPath) =>
          modelField(form, init, `${path}.${index}.${keyPath}`)
        )
        const fieldSets = [
          ...fields.slice(0, index),
          fieldSet,
          ...fields.slice(index + 1)
        ]
        const value = [
          ...valueState.slice(0, index),
          values,
          ...valueState.slice(index + 1)
        ]
        const touched = form.getTouched(path, [])
        const isTouched = [
          ...touched.slice(0, index),
          mapLeaves(values, _ => false),
          ...touched.slice(index + 1)
        ]
        form.setField(path, fieldSets)
        form.update(path, { value, isTouched })
      }
    },
    remove: {
      value(index) {
        const { form, fields, path } = this
        const fieldSets = [
          ...fields.slice(0, index),
          ...fields.slice(index + 1)
        ]
        const value = [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1)
        ]
        const touched = form.getTouched(path, [])
        const isTouched = [
          ...touched.slice(0, index),
          ...touched.slice(index + 1)
        ]
        form.setField(path, fieldSets)
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
    }
  })
}
