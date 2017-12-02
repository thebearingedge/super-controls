import { before, after } from 'mocha'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'
import chai from 'chai'
import enzyme from 'enzyme'
import deepFreeze from 'deep-freeze'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { invoke } from './util'

before(() => {
  chai.use(chaiEnzyme())
  chai.use(sinonChai)
  enzyme.configure({ adapter: new Adapter() })
  const { window } = new JSDOM()
  const { document } = window
  Object.assign(global, { window, document })
})

after(() => {
  let window, document
  Object.assign(global, { window, document })
})

export const { expect } = chai
export const { mount } = enzyme
export const { stub, spy } = sinon
export const freeze = deepFreeze

export function toThunks(path) {
  return path.split('.').map(key => () => key)
}

export function mountWith(options) {
  return function (element) {
    return mount(element, options)
  }
}

export function mockField({ paths, init }) {
  const field = {
    get init() {
      return init
    },
    get isDirty() {
      return false
    },
    get isPristine() {
      return true
    }
  }
  return Object.defineProperties(field, {
    path: {
      get: () => paths.map(invoke)
    },
    value: {
      writable: true,
      enumerable: true,
      value: init
    },
    isTouched: {
      writable: true,
      value: false
    },
    update: {
      writeable: true,
      configurable: true,
      value() {}
    },
    unregister: {
      configurable: true,
      value() {}
    }
  })
}
