export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function isInteger(value) {
  return +value === parseInt(value, 10)
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
  if (index === void 0) return { ...target, [key]: value }
  keyPath = [index, ...path].join('.')
  return { ...target, [key]: set(target[key], keyPath, value) }
}

export function get(target, keyPath, fallback) {
  const [ key, index, ...path ] = keyPath.split('.')
  if (!target[key]) return fallback
  if (isInteger(index)) {
    return target[key][index] === void 0
      ? fallback
      : get(target[key][index], path.join('.'), fallback)
  }
  if (index === void 0) return target[key]
  return get(target[key], [index, ...path].join('.'), fallback)
}

export function mapLeaves(target, transform, path = '') {
  if (Array.isArray(target)) {
    if (!isObject(target[0])) return target.slice()
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
        : predicate(target[key])
    )
}
