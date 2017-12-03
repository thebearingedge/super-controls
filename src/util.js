export const id = x => x

export const noop = () => {}

export const invoke = (fn, ...args) => fn(...args)

export const isArray = val => Array.isArray(val)

export const isObject = val => ({}).toString.call(val) === '[object Object]'

export const isString = val => typeof val === 'string'

export const isBoolean = val => typeof val === 'boolean'

export const isFunction = val => typeof val === 'function'

export const isUndefined = val => val === void 0

export const isIndex = val => Number.isInteger(val)

export const keys = obj => Object.keys(obj)

export const omit = (source, props) =>
  keys(source)
    .reduce((omitted, key) =>
      props.includes(key)
        ? omitted
        : assign(omitted, { [key]: source[key] })
      , {})

export const assign = (...args) => Object.assign({}, ...args)

export const sliceIn = (array, index, value) => [
  ...array.slice(0, index),
  value,
  ...array.slice(index)
]

export const sliceOut = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
]

export const sliceOver = (array, index, val) => {
  const sliced = [...array]
  sliced.length = Math.max(sliced.length, index)
  sliced[index] = val
  return sliced
}

export const exists = (target, key) =>
  isArray(target)
    ? !isUndefined(target[key])
    : target.hasOwnProperty(key)

export const replace = (target, key, val) =>
  isArray(target)
    ? sliceOver(target, key, val)
    : assign(target, { [key]: val })

export const remove = (target, key) =>
  isArray(target)
    ? sliceOut(target, key)
    : omit(target, [key])

export const get = (source, [key, ...path], fallback) => {
  if (isUndefined(source) || !exists(source, key)) return fallback
  if (!path.length) return source[key]
  return get(source[key], path, fallback)
}

export const set = (target, [key, index, ...path], val) => {
  if (isUndefined(index)) return replace(target, key, val)
  const nested = target[key] || (isIndex(index) ? [] : {})
  return replace(target, key, set(nested, [index, ...path], val))
}

export const unset = (target, [key, ...path], val) => {
  if (!exists(target, key)) return target
  if (!path.length) return remove(target, key)
  return replace(target, key, unset(target[key], path, val))
}

export const clone = source => {
  if (isArray(source)) return source.map(clone)
  if (isObject(source)) {
    return keys(source)
      .reduce((cloned, key) => assign(
        cloned,
        { [key]: clone(source[key]) }
      ), {})
  }
  return source
}

export const someValues = (target, predicate) => {
  if (isArray(target)) {
    return !!target.find(child => someValues(child, predicate))
  }
  if (isObject(target)) {
    return !!keys(target).find(key => someValues(target[key], predicate))
  }
  return !!predicate(target)
}

export const equalExcept = (...ignore) => (a, b) => {
  if (a === b) return true
  const aKeys = keys(a)
  const bKeys = keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => ignore.includes(key) || a[key] === b[key])
}

export const equalProps = equalExcept('name', 'children')

export const shallowEqual = equalExcept()

export const deepEqual = (a, b) => {
  if (isArray(a) && isArray(b)) {
    return a.length === b.length &&
           a.every((_, index) => deepEqual(a[index], b[index]))
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = keys(a)
    const bKeys = keys(b)
    return aKeys.length === bKeys.length &&
           aKeys.every(key => deepEqual(a[key], b[key]))
  }
  return a === b
}

export const KEY = '@@controlled-components'
