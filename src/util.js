export const id = _ => _

export const noop = _ => {}

export const toNull = _ => null

export const invoke = (fn, ...args) => fn(...args)

export const wrap = value => () => value

export const isUndefined = value => value === void 0

export const isString = value => typeof value === 'string'

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
    : assign({}, target, { [key]: value })

export const remove = (target, key) =>
  isArray(target)
    ? sliceOut(target, key)
    : omit(target, [key])

export const get = (source, [ first, ...path ], fallback) => {
  if (!exists(source, first)) return fallback
  if (!path.length) return source[first]
  return get(source[first], path, fallback)
}

export const set = (target, [ first, next, ...path ], value) => {
  if (isUndefined(next)) return replace(target, first, value)
  return replace(target, first, set(target[first], [next, ...path], value))
}

export const unset = (target, [ first, ...path ]) => {
  if (!path.length) return remove(target, first)
  return replace(target, first, unset(target[first], path))
}

export const isObject = value => ({}).toString.call(value) === '[object Object]'

export const isComplex = value => isArray(value) || isObject(value)

export const shallowEqual = (a, b) => {
  const aKeys = keys(a)
  const bKeys = keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => a[key] === b[key])
}

export const someValues = (target, predicate) =>
  isComplex(target)
    ? !!keys(target).some(key => someValues(target[key], predicate))
    : !!predicate(target)

export const toPath = names =>
  names
    .map(name => name === Math.floor(name) ? `[${name}]` : name)
    .join('.')
    .replace('.[', '[')

export const toNames = path =>
  path
    .split('.')
    .map(name => name.split('[').filter(Boolean))
    .reduce((flattened, names) => flattened.concat(names.map(name =>
      /\d\]$/.test(name) ? +name.replace(']', '') : name
    )), [])

export const wrapEvent = event =>
  assign({}, event, {
    preventDefault() {
      this.defaultPrevented = true
      event.preventDefault && event.preventDefault()
    }
  })
