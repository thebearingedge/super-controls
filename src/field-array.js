import { createElement } from 'react'
import { func, array } from 'prop-types'
import { FieldSet } from './field-set'
import {
  id,
  set,
  invoke,
  sliceIn,
  sliceOut,
  deepEqual,
  someValues
} from './util'

export class FieldArray extends FieldSet {
  modelField(form, init, paths) {
    return modelFieldArray(form, init, paths)
  }
  render() {
    const { component, children, ...props } = this.props
    const { model: fields } = this
    return createElement(component || children, {
      fields,
      ...props
    })
  }
  static get propTypes() {
    return {
      init: array,
      children: func,
      component: func
    }
  }
  static get defaultProps() {
    return {
      init: [],
      children: _ => null
    }
  }
}

export const modelFieldArray = (form, init, paths) => {
  const model = {
    get init() {
      return form.getInit(this.path, init)
    },
    get value() {
      return form.getValue(this.path, this.init)
    },
    get isTouched() {
      return someValues(this.touched, id)
    },
    get isDirty() {
      return !deepEqual(this.init, this.value)
    },
    get isPristine() {
      return !this.isDirty
    },
    get length() {
      return this.value.length
    }
  }
  return Object.defineProperties(model, {
    path: {
      get: () => paths.map(invoke)
    },
    touched: {
      get: () => form.getTouched(model.path, [])
    },
    unregister: {
      configurable: true,
      value: _ => form.unregister(model)
    },
    insert: {
      value: (index, newValue) => {
        const { path, init, value, touched } = model
        form.update(path, {
          init: sliceIn(init, index, newValue),
          value: sliceIn(value, index, newValue),
          isTouched: set(touched, [index], void 0)
        })
      }
    },
    remove: {
      value: index => {
        const { path, init, value, touched } = model
        form.update(path, {
          init: sliceOut(init, index),
          value: sliceOut(value, index),
          isTouched: sliceOut(touched, index)
        })
      }
    },
    push: {
      value: value => model.insert(model.length, value)
    },
    pop: {
      value: () => model.remove(model.length - 1)
    },
    unshift: {
      value: value => model.insert(0, value)
    },
    shift: {
      value: () => model.remove(0)
    },
    map: {
      value: transform => model.value.map((value, index) =>
        transform(value, index, model)
      )
    }
  })
}
