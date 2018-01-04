import { before, after } from 'mocha'
import { JSDOM } from 'jsdom'
import chai from 'chai'
import sinon from 'sinon'
import enzyme from 'enzyme'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as _ from './util'

chai.use(sinonChai)
chai.use(chaiEnzyme())
enzyme.configure({ adapter: new Adapter() })

before(() => {
  const { window } = new JSDOM()
  const { document } = window
  _.assign(global, { window, document })
})

after(() => _.assign(global, { window: void 0, document: void 0 }))

export const { expect } = chai
export const { mount } = enzyme
export const { stub, spy } = sinon
export const mountWith = options => element => mount(element, options)
export const toRoute = path => _.toNames(path).map(_.wrap)
