export const noop = () => {}

export const shallowEqual = (a, b) => {
  if (a === b) return true
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return aKeys.length === bKeys.length &&
         aKeys.every(key => a[key] === b[key])
}

export const pipe = (...fns) => (...args) =>
  fns
    .slice(1)
    .reduce((result, fn) => fn(result), fns[0](...args))
