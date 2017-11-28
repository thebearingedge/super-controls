import { before, after } from 'mocha'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'
import chai from 'chai'
import enzyme from 'enzyme'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { fromThunks } from './util'

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

export function toThunks(path) {
  return path.split('.').map(key => () => key)
}

export function mockField({ paths, value }) {
  const field = {
    get init() {
      return value
    },
    get value() {
      return value
    },
    get isTouched() {
      return false
    },
    get isDirty() {
      return false
    },
    get isPristine() {
      return true
    }
  }
  return Object.defineProperties(field, {
    form: {
      value: null
    },
    path: {
      get() {
        return fromThunks(paths)
      }
    },
    mutations: {
      writable: true,
      value: 0
    },
    update: {
      configurable: true,
      value() {
        field.mutations++
      }
    }
  })
}
