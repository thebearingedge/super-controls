import { Component } from 'react'
import { func, array, string } from 'prop-types'
import { equalProps, equalState, createKey, mapObject } from '../util'

export default class FieldArray extends Component {
  constructor(...args) {
    super(...args)
    this.field = this.context.registerField({
      name: this.props.name,
      value: this.props.value
    })
    this.state = { ...this.field }
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
  modelField(index, name, value) {
    const self = this
    const field = {
      get init() {
        return value
      },
      get value() {
        return self.field.value[index][name]
      },
      get isDirty() {
        return this.value !== this.init
      },
      get isTouched() {
        return self.field.isTouched
      }
    }
    return Object.defineProperties(field, {
      update: {
        enumerable: false,
        value: state => self.update(index, name, state)
      },
      setIndex: {
        enumerable: false,
        value(_index) {
          index = _index
        }
      }
    })
  }
  componentWillUpdate() {
    const { field, fieldSets, modelFieldSet } = this
    if (field.value.length !== fieldSets.length) {
      this.fieldSets = field.value.map(modelFieldSet)
    }
  }
  componentDidUpdate() {
    this.setState({ ...this.field })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equalState(this.field, nextState) ||
           !equalProps(this.props, nextProps)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  modelFieldSet(values, index) {
    const fieldSet = mapObject(values, (key, value) =>
      this.modelField(index, key, value)
    )
    return Object.defineProperties(fieldSet, {
      init: {
        enumerable: false,
        value: values
      },
      key: {
        enumerable: false,
        value: createKey()
      },
      setIndex: {
        enumerable: false,
        value(index) {
          Object.keys(this).forEach(key => this[key].setIndex(index))
        }
      }
    })
  }
  modelArray() {
    const self = this
    return {
      get length() {
        return self.field.value.length
      },
      map(transform) {
        return self.field.value.map((values, i) =>
          transform(values, i, self.fieldSets[i].key)
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
        self.fieldSets.slice(index).forEach((fieldSet, i) =>
          fieldSet.setIndex(i + index + 1)
        )
        const value = [...self.field.value]
        self.fieldSets.splice(index, 0, self.modelFieldSet(values, index))
        value.splice(index, 0, values)
        self.field.update({ value })
      },
      remove(index) {
        self.fieldSets.slice(index + 1).forEach((fieldSet, i) =>
          fieldSet.setIndex(i + index)
        )
        const value = [...self.field.value]
        self.fieldSets.splice(index, 1)
        value.splice(index, 1)
        self.field.update({ value })
      }
    }
  }
  update(index, name, state) {
    const { value, isTouched } = this.field
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
