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

export function set(target, keyPath, value) {
  const [ key, index, ...path ] = keyPath
  if (isInteger(index)) {
    target[key] = target[key] || []
    target[key][index] = target[key][index] || {}
    return {
      ...target,
      [key]: [
        ...target[key].slice(0, index),
        set(target[key][index], path, value),
        ...target[key].slice(index + 1)
      ]
    }
  }
  if (isUndefined(index)) return { ...target, [key]: value }
  return { ...target, [key]: set(target[key], [index, ...path], value) }
}

export function get(target, keyPath, fallback) {
  const [ key, index, ...path ] = keyPath
  if (isUndefined(target[key])) return fallback
  if (isInteger(index)) {
    return isUndefined(target[key][index])
      ? fallback
      : get(target[key][index], path, fallback)
  }
  if (isUndefined(index)) return target[key]
  return get(target[key], [index, ...path], fallback)
}

export function mapLeaves(target, transform, path = []) {
  if (isArray(target)) {
    if (!isObject(target[0])) return transform(target, path)
    return target.map((child, i) => {
      return mapLeaves(child, transform, [...path, i])
    })
  }
  return Object.keys(target)
    .reduce((mapped, key) => {
      const keyPath = [...path, key]
      return isObject(target[key]) || isArray(target[key])
        ? { ...mapped, [key]: mapLeaves(target[key], transform, keyPath) }
        : { ...mapped, [key]: transform(target[key], keyPath) }
    }, {})
}

export function someLeaves(target, predicate) {
  if (isArray(target)) {
    if (!target.length) return false
    return isObject(target[0]) &&
           !!target.find(child => someLeaves(child, predicate))
  }
  return !!Object.keys(target)
    .find(key =>
      isObject(target[key]) || isArray(target)
        ? someLeaves(target[key], predicate)
        : predicate(target)
    )
}

export function fromThunks(thunks) {
  return thunks.map(thunk => thunk())
}

export function toThunks(path) {
  return path.map(name => () => name)
}

export function shallowEqual(a, b) {
  if (a === b) return true
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => aKeys[key] === bKeys[key])
}
