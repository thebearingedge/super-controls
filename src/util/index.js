export const shallowEqual = (a, b) => {
  if (a === b) return true
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => a[key] === b[key])
}

export const set = (target, [ key, ...path ], value) => {
  if (!path.length) return { ...target, [key]: value }
  target[key] = target[key] || {}
  return {
    ...target,
    [key]: {
      ...target[key],
      ...set(target[key], path, value)
    }
  }
}

export const expand = target =>
  Object
    .keys(target)
    .reduce((expanded, key) => set(expanded, key.split('.'), target[key]), {})

export const isObject = value =>
  Object.prototype.toString.call(value) === '[object Object]'

export const collapse = (target, path = '') => {
  return Object
    .keys(target)
    .reduce((collapsed, key) => {
      const keyPath = `${path}${path && '.'}${key}`
      return isObject(target[key])
        ? { ...collapsed, ...collapse(target[key], keyPath) }
        : { ...collapsed, [keyPath]: target[key] }
    }, {})
}

export const createKey = () => Math.random().toString(36).substr(2, 10)

export const omit = (source, keys) =>
  Object.keys(source)
    .filter(key => !keys.includes(key))
    .reduce((omitted, key) => ({
      ...omitted,
      [key]: source[key]
    }), {})
