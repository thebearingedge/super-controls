export const id = _ => _

export const noop = _ => {}

export const toNull = _ => null

export const invoke = fn => fn()

export const wrap = value => () => value

export const isUndefined = value => value === void 0

export const isString = value => typeof value === 'string'

export const isBoolean = value => typeof value === 'boolean'

export const isFunction = value => typeof value === 'function'

export const { keys } = Object

export const omit = (source, omitting) =>
  keys(source).reduce((omitted, key) => {
    return ~omitting.indexOf(key)
      ? omitted
      : assign(omitted, { [key]: source[key] })
  }, {})

export const pick = (source, picking) =>
  picking.reduce((picked, key) => assign(
    picked, { [key]: source[key] }
  ), {})

export const pickBy = (source, predicate) =>
  keys(source).reduce((picked, key) => {
    return predicate(source[key], key)
      ? assign(picked, { [key]: source[key] })
      : picked
  }, {})

export const exists = (target, key) => !isUndefined(target[key])

export const defaults = (target, ...sources) =>
  sources.reduce((defaulted, source) => assign(
    defaulted, pickBy(source, (_, key) => !exists(defaulted, key))
  ), target)

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

export const { isArray } = Array

export const replace = (target, key, value) =>
  isArray(target)
    ? sliceOver(target, key, value)
    : assign(target, { [key]: value })

export const remove = (target, key) =>
  isArray(target)
    ? sliceOut(target, key)
    : omit(target, [key])

export const get = (source, [ key, ...path ], fallback) => {
  if (!exists(source, key)) return fallback
  if (!path.length) return source[key]
  return get(source[key], path, fallback)
}

export const set = (target, [ first, next, ...rest ], value) => {
  if (isUndefined(next)) return replace(target, first, value)
  return replace(target, first, set(target[first], [next, ...rest], value))
}

export const unset = (target, [ key, ...path ]) => {
  if (!exists(target, key)) return target
  if (!path.length) return remove(target, key)
  return replace(target, key, unset(target[key], path))
}

export const isObject = value => ({}).toString.call(value) === '[object Object]'

export const isComplex = value => isArray(value) || isObject(value)

export const someValues = (source, predicate) =>
  isComplex(source)
    ? !!keys(source).find(key => someValues(source[key], predicate))
    : !!predicate(source)

export const shallowEqual = (a, b) => {
  if (isComplex(a) && isComplex(b)) {
    const aKeys = keys(a)
    const bKeys = keys(b)
    return aKeys.length === bKeys.length &&
           aKeys.every(key => a[key] === b[key])
  }
  return a === b
}

export const toPath = names =>
  names
    .map(name => name === Math.floor(name) ? `[${name}]` : name)
    .join('.')
    .replace('.[', '[')

export const toNames = path =>
  path
    .split('.')
    .map(name => name.split('['))
    .reduce((flattened, names) => flattened.concat(names.map(name =>
      /\d\]/.test(name) ? +name.replace(']', '') : name
    )), [])

export const wrapEvent = event =>
  assign({}, event, {
    preventDefault() {
      this.defaultPrevented = true
      event.preventDefault && event.preventDefault()
    }
  })
