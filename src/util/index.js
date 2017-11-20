export const shallowEqual = (a, b) => {
  if (a === b) return true
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => a[key] === b[key])
}

const set = (target, [ key, ...path ], value) => {
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
