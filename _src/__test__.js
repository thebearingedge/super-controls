import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { fromPath } from './util'

chai.use(sinonChai)

export const { expect } = chai
export const { stub, spy } = sinon
export const toRoute = path => fromPath(path).map(name => () => name)
