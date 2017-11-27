import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, toThunks } from './__test__'
import Form from './_form'

describe('_Form', () => {

  it('renders a form element', () => {
    const wrapper = mount(<Form/>)
    expect(wrapper).to.have.tagName('form')
  })

  it('has an initial values state', () => {
    const wrapper = mount(<Form values={{ foo: '', bar: '' }}/>)
    expect(wrapper)
      .to.have.state('values')
      .that.deep.equals({ foo: '', bar: '' })
  })

  it('has an initial touched state', () => {
    const wrapper = mount(<Form values={{ foo: '', bar: '' }}/>)
    expect(wrapper)
      .to.have.state('touched')
      .that.deep.equals({ foo: false, bar: false })
  })

  it('has a nested initial values state', () => {
    const values = {
      foo: {
        bar: {
          baz: ''
        }
      }
    }
    const wrapper = mount(<Form values={values}/>)
    expect(wrapper)
      .to.have.state('values')
      .that.deep.equals(values)
  })

  it('has a nested initial touched state', () => {
    const values = {
      foo: {
        bar: {
          baz: ''
        }
      }
    }
    const wrapper = mount(<Form values={values}/>)
    expect(wrapper)
      .to.have.state('touched')
      .that.deep.equals({
        foo: {
          bar: {
            baz: false
          }
        }
      })
  })

  it('has an initial values state containing arrays', () => {
    const values = {
      foo: [
        { bar: '' },
        { bar: '' }
      ]
    }
    const wrapper = mount(<Form values={values}/>)
    expect(wrapper)
      .to.have.state('values')
      .that.deep.equals(values)
  })

  it('has an initial touched state containing arrays', () => {
    const values = {
      foo: [
        { bar: '' },
        { bar: '' }
      ]
    }
    const wrapper = mount(<Form values={values}/>)
    expect(wrapper)
      .to.have.state('touched')
      .that.deep.equals({
        foo: [
          { bar: false },
          { bar: false }
        ]
      })
  })

  describe('registerField', () => {

    it('retrieves fields by path', () => {
      const values = {
        foo: {
          bar: {
            baz: [{ qux: '' }]
          }
        }
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerField({
        paths: toThunks('foo.bar.baz.0.qux')
      })
      expect(field).to.deep.equal({
        init: '',
        value: '',
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('registers new fields', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            values: { foo: 'foo' },
            touched: { foo: false }
          })
          done()
        }
      }
      const wrapper = mount(<TestForm/>)
      const form = wrapper.instance()
      form.registerField({ paths: toThunks('foo'), value: 'foo' })
    })

    it('registers new nested fields', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            values: { foo: { bar: 'bar' } },
            touched: { foo: { bar: false } }
          })
          done()
        }
      }
      const wrapper = mount(<TestForm/>)
      const form = wrapper.instance()
      form.registerField({ paths: toThunks('foo.bar'), value: 'bar' })
    })

    it('registers new fields in arrays', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            values: { foo: [{ bar: 'bar' }] },
            touched: { foo: [{ bar: false }] }
          })
          done()
        }
      }
      const wrapper = mount(<TestForm/>)
      const form = wrapper.instance()
      form.registerField({ paths: toThunks('foo.0.bar'), value: 'bar' })
    })

  })

  describe('registerFieldSet', () => {

    it('returns a field set wrapper', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const field = form.registerFieldSet({
        paths: toThunks('foo'),
        value: { bar: '' }
      })
      expect(form.state).to.deep.equal({
        values: { foo: { bar: '' } },
        touched: { foo: { bar: false } }
      })
      expect(field).to.deep.equal({
        fields: {},
        init: { bar: '' },
        value: { bar: '' },
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

  })

  describe('registerFieldArray', () => {

    it('returns a field array wrapper', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo'),
        value: []
      })
      expect(form.state).to.deep.equal({
        values: { foo: [] },
        touched: { foo: [] }
      })
      expect(field).to.deep.equal({
        fields: [],
        length: 0,
        init: [],
        value: [],
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('"pushes" a new field into an array', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(this.state).to.deep.equal({
            values: {
              foo: [
                { bar: '' },
                { bar: 'baz' }
              ]
            },
            touched: {
              foo: [
                { bar: false },
                { bar: false }
              ]
            }
          })
          done()
        }
      }
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<TestForm values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo'),
        value: []
      })
      bars.push({ bar: 'baz' })
    })

    it('"pops" a field from an array', () => {
      const values = { foo: [{ bar: 'baz' }, { bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo'),
        value: []
      })
      bars.pop()
      expect(form.state).to.deep.equal({
        values: { foo: [{ bar: 'baz' }] },
        touched: { foo: [{ bar: false }] }
      })
    })

    it('"unshifts" a new field into an array', done => {
      class TestForm extends Form {
        componentDidUpdate() {
          expect(form.state).to.deep.equal({
            values: { foo: [{ bar: '' }, { bar: '' }] },
            touched: { foo: [{ bar: false }, { bar: false }] }
          })
          done()
        }
      }
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<TestForm values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo'),
        value: []
      })
      bars.unshift({ bar: '' })
    })

    it('"shift"s a field from an array', () => {
      const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo'),
        value: []
      })
      bars.shift()
      expect(form.state).to.deep.equal({
        values: { foo: [{ bar: 'baz' }] },
        touched: { foo: [{ bar: false }] }
      })
    })

  })

})
