import { Component } from 'react'
import { func, array, string } from 'prop-types'
import { equalProps, equalState, createKey } from '../util'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.field = this.context.registerField({
      name: this.props.name,
      value: this.props.value
    })
    this.state = { ...this.field.state }
    this.update = this.update.bind(this)
    this.modelFieldSet = this.modelFieldSet.bind(this)
    this.registerField = this.registerField.bind(this)
    this.fieldSets = this.state.value.map(this.modelFieldSet)
    this.array = this.modelArray()
  }
  registerField({ name: path, value }) {
    const [ index ] = path.match(/\d+/)
    const name = path.replace(/\d+\./, '')
    return this.fieldSets[index][name]
  }
  modelField(fieldArray, index, name, value) {
    return {
      state: {
        get init() {
          return value
        },
        get value() {
          return fieldArray.field.state.value[index][name]
        },
        get isDirty() {
          return this.value !== this.init
        },
        get isTouched() {
          return fieldArray.field.state.isTouched
        }
      },
      update(state) {
        fieldArray.update(index, name, state)
      },
      setIndex(_index) {
        index = _index
      }
    }
  }
  componentWillUpdate() {
    const { field, fieldSets, modelFieldSet } = this
    if (field.state.value.length !== fieldSets.length) {
      this.fieldSets = field.state.value.map(modelFieldSet)
    }
  }
  componentDidUpdate() {
    this.setState(this.field.state)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalState(this.field.state, nextState) ||
           !equalProps(this.props, nextProps)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  modelFieldSet(values, index) {
    const model = Object
      .keys(values)
      .reduce((modeled, key) => ({
        ...modeled,
        [key]: this.modelField(this, index, key, values[key])
      }), {})
    return Object.defineProperty(model, '__FIELD_SET_KEY__', {
      enumarable: false,
      value: createKey()
    })
  }
  modelArray() {
    const self = this
    return {
      get length() {
        return self.field.state.value.length
      },
      map(transform) {
        return self.field.state.value.map((values, i) =>
          transform(values, String(i), self.fieldSets[i].__FIELD_SET_KEY__)
        )
      },
      pop() {
        this.remove(self.fieldSets.length - 1)
      },
      push(values) {
        this.insert(self.fieldSets.length, values)
      },
      shift() {
        this.remove(0)
      },
      unshift(values) {
        this.insert(0, values)
      },
      insert(index, values) {
        self.fieldSets.slice(index).forEach((modeled, i) =>
          Object.keys(modeled).forEach(key =>
            modeled[key].setIndex(i + index + 1)
          )
        )
        const value = [...self.field.state.value]
        self.fieldSets.splice(index, 0, self.modelFieldSet(values, index))
        value.splice(index, 0, values)
        self.field.update({ value })
      },
      remove(index) {
        self.fieldSets.slice(index + 1).forEach((modeled, i) =>
          Object.keys(modeled).forEach(key =>
            modeled[key].setIndex(i + index)
          )
        )
        const value = [...self.field.state.value]
        self.fieldSets.splice(index, 1)
        value.splice(index, 1)
        self.field.update({ value })
      }
    }
  }
  update(index, name, state) {
    const { value, isTouched } = this.field.state
    const updates = { value, isTouched }
    if ('value' in state) {
      updates.value = [
        ...value.slice(0, index),
        { ...value[index], [name]: state.value },
        ...value.slice(index + 1)
      ]
    }
    if ('isTouched' in state) {
      updates.isTouched = isTouched || !!state.isTouched
    }
    this.field.update(updates)
  }
  render() {
    return this.props.children(this.array)
  }
}

FieldArray.propTypes = {
  name: string.isRequired,
  children: func,
  value: array
}

FieldArray.defaultProps = {
  value: [],
  children: () => null
}

FieldArray.contextTypes = {
  registerField: func.isRequired
}

FieldArray.childContextTypes = {
  registerField: func
}
