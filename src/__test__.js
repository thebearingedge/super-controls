import { before, after } from 'mocha'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'
import chai from 'chai'
import enzyme from 'enzyme'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16'

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
export const mockField = value => {
  let isTouched
  const field = {
    get value() {
      return value
    },
    get isTouched() {
      return !!isTouched
    }
  }
  return Object.defineProperty(field, 'update', {
    configurable: true,
    enumerable: false,
    value() {}
  })
}
