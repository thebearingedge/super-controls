export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function isInteger(value) {
  return Number.isInteger(parseInt(value, 10))
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
    return get(target[key][index], path.join('.'), fallback)
  }
  if (index === void 0) return target[key]
  return get(target[key], [index, ...path].join('.'), fallback)
}

export function mapLeaves(target, transform, path = '') {
  return Object.keys(target)
    .reduce((mapped, key) => {
      const keyPath = `${path}${path && '.'}${key}`
      if (Array.isArray(target[key]) && isObject(target[key][0])) {
        const children = target[key].map((child, i) =>
          mapLeaves(child, transform, `${keyPath}.${i}`)
        )
        return { ...mapped, [key]: children }
      }
      return isObject(target[key])
        ? { ...mapped, [key]: mapLeaves(target[key], transform, keyPath) }
        : { ...mapped, [key]: transform(target[key], keyPath) }
    }, {})
}
