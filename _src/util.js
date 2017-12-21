export const id = _ => _

export const noop = _ => void 0

export const invoke = fn => fn()

export const isUndefined = val => val === void 0

export const isString = val => typeof val === 'string'

export const isBoolean = val => typeof val === 'boolean'

export const { isArray } = Array

export const isObject = value => ({}).toString.call(value) === '[object Object]'

export const isReference = val => isArray(val) || isObject(val)

export const { keys } = Object

export const omit = (source, props) =>
  keys(source).reduce((omitted, key) => {
    return props.includes(key)
      ? omitted
      : assign(omitted, { [key]: source[key] })
  }, {})

export const pick = (source, props) =>
  props.reduce((picked, prop) => assign(
    picked,
    { [prop]: source[prop] }
  ), {})

export const pickBy = (source, predicate) =>
  keys(source).reduce((picked, key) => {
    return predicate(source[key], key)
      ? assign(picked, { [key]: source[key] })
      : picked
  }, {})

export const defaults = (target, ...sources) =>
  sources.reduce((defaulted, source) => assign(
    defaulted,
    pickBy(source, (_, key) => !(key in defaulted))
  ), target)

export const toPath = names =>
  names
    .map(name => +name === parseInt(name, 10) ? `[${name}]` : name)
    .join('.')
    .replace(/\.\[/g, '[') || ''

export const fromPath = path =>
  path
    .split('.')
    .map(segment => segment.split('['))
    .reduce((flattened, names) => flattened.concat(names.map(name =>
      /\d\]/.test(name) ? +name.replace(']', '') : name
    )), [])

export const { assign } = Object

export const sliceIn = (target, index, value) => {
  const init = target.slice(0, index)
  init[index] = value
  return init.concat(target.slice(index))
}

export const sliceOut = (target, index) => [
  ...target.slice(0, index),
  ...target.slice(index + 1)
]

export const sliceOver = ([ ...sliced ], index, value) => {
  sliced[index] = value
  return sliced
}

export const exists = (target, key) => !isUndefined(target[key])

export const replace = (target, key, val) =>
  isArray(target)
    ? sliceOver(target, key, val)
    : assign(target, { [key]: val })

export const remove = (target, key) =>
  isArray(target)
    ? sliceOut(target, key)
    : omit(target, [key])

export const get = (source, [key, ...path], fallback) => {
  if (!exists(source, key)) return fallback
  if (!path.length) return source[key]
  return get(source[key], path, fallback)
}

export const set = (target, [key, index, ...path], value) => {
  if (isUndefined(index)) return replace(target, key, value)
  return replace(target, key, set(target[key], [index, ...path], value))
}

export const unset = (target, [key, ...path]) => {
  if (!exists(target, key)) return target
  if (!path.length) return remove(target, key)
  return replace(target, key, unset(target[key], path))
}

export const someValues = (source, predicate) =>
  isReference(source)
    ? !!keys(source).find(key => someValues(source[key], predicate))
    : !!predicate(source)

export const equals = (a, b, compare) => {
  if (a === b) return true
  if (isReference(a) && isReference(b)) {
    const aKeys = keys(a)
    const bKeys = keys(b)
    return aKeys.length === bKeys.length &&
           aKeys.every(key => compare(a[key], b[key]))
  }
  return false
}

export const strictEqual = (a, b) => a === b

export const shallowEqual = (a, b) => equals(a, b, strictEqual)

export const deepEqual = (a, b) => shallowEqual(a, b) || equals(a, b, deepEqual)
