export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function isInteger(value) {
  return +value === parseInt(value, 10)
}

export function isUndefined(value) {
  return value === void 0
}

export function isArray(value) {
  return Array.isArray(value)
}

export function keys(obj) {
  return Object.keys(obj)
}

export function omit(obj, props) {
  return keys(obj)
    .filter(key => !props.includes(key))
    .reduce((omitted, key) => ({
      ...omitted,
      [key]: obj[key]
    }), {})
}

export function set(target, [ key, index, ...path ], value) {
  if (isUndefined(index)) {
    return isObject(target)
      ? { ...target, [key]: value }
      : [...target.slice(0, key), value, ...target.slice(key + 1)]
  }
  if (isInteger(index)) {
    const nested = target[key] || []
    if (isArray(target)) {
      return [
        ...target.slice(0, key),
        set(nested, [index, ...path], value),
        ...target.slice(key + 1)
      ]
    }
    return {
      ...target,
      [key]: [
        ...nested.slice(0, index),
        ...set(nested, [index, ...path], value),
        ...nested.slice(index + 1)
      ]
    }
  }
  const nested = target[key] || {}
  if (isArray(target)) {
    return [
      ...target.slice(0, key),
      set(nested, [index, ...path], value),
      ...target.slice(key + 1)
    ]
  }
  return {
    ...target,
    [key]: set(nested, [index, ...path], value)
  }
}

export function get(source, [key, ...path], fallback) {
  if (isUndefined(source[key])) return fallback
  if (!path.length) return source[key]
  return get(source[key], path, fallback)
}

export function mapProperties(target, transform, path = []) {
  if (isArray(target)) {
    if (!isObject(target[0])) return transform(target, path)
    return target.map((child, i) =>
      mapProperties(child, transform, [...path, i])
    )
  }
  return keys(target)
    .reduce((mapped, key) => {
      const keyPath = [...path, key]
      return isObject(target[key]) || isArray(target[key])
        ? { ...mapped, [key]: mapProperties(target[key], transform, keyPath) }
        : { ...mapped, [key]: transform(target[key], keyPath) }
    }, {})
}

export function someLeaves(target, predicate) {
  if (isArray(target)) {
    return !!target.length &&
           isObject(target[0]) &&
           !!target.find(child => someLeaves(child, predicate))
  }
  return !!keys(target)
    .find(key =>
      isObject(target[key]) || isArray(target)
        ? someLeaves(target[key], predicate)
        : predicate(target)
    )
}

export function fromThunks(thunks) {
  return thunks.map(thunk => thunk())
}

export function id(x) {
  return x
}

export function createKey() {
  return Math.random().toString(36).substr(2, 10)
}

export function equalExcept(...skip) {
  return function (a, b) {
    if (a === b) return true
    const aKeys = keys(a)
    const bKeys = keys(b)
    return aKeys.length === bKeys.length &&
           aKeys.every(key => skip.includes(key) || a[key] === b[key])
  }
}

export const equalProps = equalExcept('name', 'children')
