import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, toThunks } from './__test__'
import Form from './form'

describe('Form', () => {

  describe('render', () => {

    it('renders a form element', () => {
      const wrapper = mount(<Form/>)
      expect(wrapper).to.have.tagName('form')
    })

  })

  describe('constructor', () => {

    it('has an initial state', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        values: {},
        touched: {}
      })
      expect(form.init).to.deep.equal({})
    })

    it('reads its initial values from props', () => {
      const values = { foo: '', bar: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        values,
        touched: {}
      })
      expect(form.init).to.deep.equal(values)
    })

    it('reads an intial nested values state', () => {
      const values = {
        foo: {
          bar: {
            baz: ''
          }
        }
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        values,
        touched: {}
      })
      expect(form.init).to.deep.equal(values)
    })

    it('reads an initial values state containing arrays', () => {
      const values = {
        foo: [
          { bar: '' },
          { bar: '' }
        ]
      }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        values,
        touched: {}
      })
      expect(form.init).to.deep.equal(values)
    })

  })

  describe('registerField', () => {

    it('registers fields by path', () => {
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
      expect(form.state).to.deep.equal({
        values,
        touched: { foo: { bar: { baz: [{ qux: false }] } } }
      })
    })

    it('registers fields for which it holds no values', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const field = form.registerField({
        paths: toThunks('foo'),
        value: 'foo'
      })
      expect(field).to.deep.equal({
        init: 'foo',
        value: 'foo',
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
      expect(form.state).to.deep.equal({
        values: { foo: 'foo' },
        touched: { foo: false }
      })
    })

    it('receives value updates from fields', () => {
      const values = { foo: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerField({
        paths: toThunks('foo')
      })
      field.update({ value: 'bar' })
      expect(form.state).to.deep.equal({
        values: { foo: 'bar' },
        touched: { foo: false }
      })
      expect(field).to.deep.equal({
        init: '',
        value: 'bar',
        isTouched: false,
        isDirty: true,
        isPristine: false
      })
    })

    it('receives touch updates from fields', () => {
      const values = { foo: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerField({
        paths: toThunks('foo')
      })
      field.update({ isTouched: true })
      expect(form.state).to.deep.equal({
        values: { foo: '' },
        touched: { foo: true }
      })
      expect(field).to.deep.equal({
        init: '',
        value: '',
        isTouched: true,
        isDirty: false,
        isPristine: true
      })
    })

    it('does not overwrite touched state for duplicate fields', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const first = form.registerField({
        paths: toThunks('foo'),
        value: 'foo'
      })
      first.update({ isTouched: true })
      expect(first.isTouched).to.equal(true)
      const second = form.registerField({
        paths: toThunks('foo'),
        value: 'foo'
      })
      expect(second.isTouched).to.equal(true)
    })

  })

  describe('registerFieldSet', () => {

    it('returns a field set wrapper', () => {
      const values = { foo: { bar: '' } }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const fieldSet = form.registerFieldSet({
        paths: toThunks('foo')
      })
      expect(fieldSet).to.deep.equal({
        fields: {},
        init: { bar: '' },
        value: { bar: '' },
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('registers an initial value', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const fieldSet = form.registerFieldSet({
        paths: toThunks('foo'),
        value: { bar: '' }
      })
      expect(form.state).to.deep.equal({
        values: { foo: { bar: '' } },
        touched: {}
      })
      expect(form.init).to.deep.equal({
        foo: { bar: '' }
      })
      expect(fieldSet).to.deep.equal({
        fields: {},
        init: { bar: '' },
        value: { bar: '' },
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('is touched if any of its descendant fields are touched', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const fieldSet = form.registerFieldSet({
        paths: toThunks('foo'),
        value: { bar: '' }
      })
      const bar = form.registerField({
        paths: toThunks('foo.bar')
      })
      bar.update({ isTouched: true })
      expect(fieldSet).to.deep.equal({
        fields: { bar },
        init: { bar: '' },
        value: { bar: '' },
        isTouched: true,
        isDirty: false,
        isPristine: true
      })
    })

  })

  describe('registerFieldArray', () => {

    it('returns a field array wrapper', () => {
      const values = { foo: [] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo')
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

    it('registers an initial value', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo'),
        value: [{ bar: '' }, { bar: '' }]
      })
      expect(form.state).to.deep.equal({
        values: {
          foo: [{ bar: '' }, { bar: '' }]
        },
        touched: {}
      })
      expect(form.init).to.deep.equal({
        foo: [{ bar: '' }, { bar: '' }]
      })
      expect(field).to.deep.equal({
        fields: [],
        length: 2,
        init: [{ bar: '' }, { bar: '' }],
        value: [{ bar: '' }, { bar: '' }],
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('is touched if the length of its value has changed', () => {
      const values = { foo: [] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo')
      })
      wrapper.setState({
        values: { foo: [{ bar: '' }] }
      })
      expect(field.isTouched).to.equal(true)
    })

    it('is touched if any of its descendant fields are touched', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const bar = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bar.update({ isTouched: true })
      expect(field.isTouched).to.equal(true)
    })

    it('is dirty if the length of its value has changed', () => {
      const values = { foo: [] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo')
      })
      wrapper.setState({
        values: { foo: [{ bar: '' }] }
      })
      expect(field.isDirty).to.equal(true)
      expect(field.isPristine).to.equal(false)
    })

    it('is dirty if any of its descendant fields are dirty', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const field = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const bar = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bar.update({ value: 'baz' })
      expect(field.isDirty).to.equal(true)
      expect(field.isPristine).to.equal(false)
    })

    it('"pushes" a new field into an array', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      form.registerField({
        paths: toThunks('foo.0.bar'),
        value: ''
      })
      bars.push({ bar: 'baz' })
      expect(form.init).to.deep.equal({
        foo: [
          { bar: '' },
          { bar: 'baz' }
        ]
      })
      expect(form.state).to.deep.equal({
        values: {
          foo: [
            { bar: '' },
            { bar: 'baz' }
          ]
        },
        touched: {
          foo: [
            { bar: false },
            {}
          ]
        }
      })
    })

    it('"pops" a field from an array', () => {
      const values = { foo: [{ bar: 'baz' }, { bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      form.registerField({
        paths: toThunks('foo.0.bar')
      })
      form.registerField({
        paths: toThunks('foo.1.bar')
      })
      bars.pop()
      expect(form.init).to.deep.equal({
        foo: [
          { bar: 'baz' }
        ]
      })
      expect(form.state).to.deep.equal({
        values: { foo: [{ bar: 'baz' }] },
        touched: { foo: [{ bar: false }] }
      })
    })

    it('"unshifts" a new field into an array', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bars.unshift({ bar: '' })
      expect(form.init).to.deep.equal({
        foo: [{ bar: '' }, { bar: '' }]
      })
      expect(form.state).to.deep.equal({
        values: { foo: [{ bar: '' }, { bar: '' }] },
        touched: { foo: [{}, { bar: false }] }
      })
    })

    it('"shift"s a field from an array', () => {
      const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      form.registerField({
        paths: toThunks('foo.0.bar')
      })
      form.registerField({
        paths: toThunks('foo.1.bar')
      })
      bars.shift()
      expect(form.state).to.deep.equal({
        values: { foo: [{ bar: 'baz' }] },
        touched: { foo: [{ bar: false }] }
      })
    })

    it('"maps" over its values', () => {
      const values = { foo: [{ bar: '' }, { bar: '' }, { bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const mapped = bars.map((...args) => args)
      mapped.forEach(([bar, index, key]) => {
        expect(bar).to.deep.equal({ bar: '' })
        expect(index).to.be.a('number')
        expect(key).to.be.a('string')
      })
    })

  })

})
