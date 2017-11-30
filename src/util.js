export const noop = () => {}

export const isObject = val =>
  Object.prototype.toString.call(val) === '[object Object]'

export const isInteger = val => +val === parseInt(val, 10)

export const isUndefined = val => val === void 0

export const isArray = val => Array.isArray(val)

export const keys = obj => Object.keys(obj)

export const omit = (obj, props) =>
  keys(obj)
    .filter(key => !props.includes(key))
    .reduce((omitted, key) => assign(omitted, { [key]: obj[key] }), {})

export const assign = (...args) => Object.assign({}, ...args)

export const sliceIn = (array, index, val) => [
  ...array.slice(0, index),
  val,
  ...array.slice(index)
]

export const sliceOut = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
]

export const sliceOver = (array, index, val) => [
  ...array.slice(0, index),
  val,
  ...array.slice(index + 1)
]

export const insert = (target, key, val) =>
  isArray(target)
    ? sliceIn(target, key, val)
    : assign(target, { [key]: val })

export const replace = (target, key, val) =>
  isArray(target)
    ? sliceOver(target, key, val)
    : assign(target, { [key]: val })

export const exists = (target, key) =>
  isArray(target)
    ? !isUndefined(target[key])
    : target.hasOwnProperty(key)

export const remove = (target, key) =>
  isArray(target)
    ? sliceOut(target, key)
    : omit(target, [key])

export const add = (...args) => update(insert, ...args)

export const set = (...args) => update(replace, ...args)

export const update = (modify, target, [key, index, ...path], val) => {
  if (isUndefined(index)) return modify(target, key, val)
  const nested = target[key] || (isInteger(index) ? [] : {})
  return replace(target, key, update(modify, nested, [index, ...path], val))
}

export const get = (source, [key, ...path], fallback) => {
  if (!exists(source, key)) return fallback
  if (!path.length) return source[key]
  return get(source[key], path, fallback)
}

export const unset = (target, [key, ...path], val) => {
  if (!exists(target, key)) return target
  if (path.length) return replace(target, key, unset(target[key], path, val))
  return target[key] === val ? remove(target, key) : target
}

export const mapProperties = (target, fn, path = []) => {
  if (isArray(target)) {
    return target.map((child, i) =>
      mapProperties(child, fn, [...path, i])
    )
  }
  if (isObject(target)) {
    return keys(target)
      .reduce((mapped, key) => {
        const keyPath = [...path, key]
        return isObject(target[key]) || isArray(target[key])
          ? { ...mapped, [key]: mapProperties(target[key], fn, keyPath) }
          : { ...mapped, [key]: fn(target[key], keyPath) }
      }, {})
  }
  return fn(target, path)
}

export const someLeaves = (target, fn) => {
  if (isArray(target)) {
    return isObject(target[0]) &&
           !!target.find(child => someLeaves(child, fn))
  }
  return !!keys(target)
    .find(key =>
      isObject(target[key]) || isArray(target[key])
        ? someLeaves(target[key], fn)
        : fn(target)
    )
}

export const id = x => x

export const invoke = (fn, ...args) => fn(...args)

export const createKey = _ => Math.random().toString(36).substr(2, 10)

export const equalExcept = (...ignore) => (a, b) => {
  if (a === b) return true
  const aKeys = keys(a)
  const bKeys = keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => ignore.includes(key) || a[key] === b[key])
}

export const equalProps = equalExcept('name', 'children')

export const shallowEqual = equalExcept()
