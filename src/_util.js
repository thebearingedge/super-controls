export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function isInteger(value) {
  return +value === parseInt(value, 10)
}

export function isUndefined(value) {
  return value === void 0
}

export function set(target, keyPath, value) {
  const [ key, index, ...path ] = keyPath.split('.')
  if (isInteger(index)) {
    target[key] = target[key] || []
    target[key][index] = target[key][index] || {}
    return {
      ...target,
      [key]: [
        ...target[key].slice(0, index),
        set(target[key][index], path.join('.'), value),
        ...target[key].slice(index + 1)
      ]
    }
  }
  if (isUndefined(index)) return { ...target, [key]: value }
  keyPath = [index, ...path].join('.')
  return { ...target, [key]: set(target[key], keyPath, value) }
}

export function get(target, keyPath, fallback) {
  const [ key, index, ...path ] = keyPath.split('.')
  if (isUndefined(target[key])) return fallback
  if (isInteger(index)) {
    return isUndefined(target[key][index])
      ? fallback
      : get(target[key][index], path.join('.'), fallback)
  }
  if (isUndefined(index)) return target[key]
  return get(target[key], [index, ...path].join('.'), fallback)
}

export function mapLeaves(target, transform, path = '') {
  if (Array.isArray(target)) {
    if (!isObject(target[0])) return transform(target, path)
    return target.map((child, i) => {
      const keyPath = `${path}${path && '.'}${i}`
      return mapLeaves(child, transform, keyPath)
    })
  }
  return Object.keys(target)
    .reduce((mapped, key) => {
      const keyPath = `${path}${path && '.'}${key}`
      return isObject(target[key]) || Array.isArray(target[key])
        ? { ...mapped, [key]: mapLeaves(target[key], transform, keyPath) }
        : { ...mapped, [key]: transform(target[key], keyPath) }
    }, {})
}

export function someLeaves(target, predicate) {
  if (Array.isArray(target)) {
    if (!target.length) return false
    return isObject(target[0]) &&
           !!target.find(child => someLeaves(child, predicate))
  }
  return !!Object.keys(target)
    .find(key =>
      isObject(target[key])
        ? someLeaves(target[key], predicate)
        : predicate(target)
    )
}

export function toPaths(path) {
  return path.split('.').map(key => () => key)
}

export function fromPaths(paths) {
  return paths.map(path => path()).join('.')
}

export function shallowEqual(a, b) {
  if (a === b) return true
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => aKeys[key] === bKeys[key])
}
