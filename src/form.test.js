import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, toThunks } from './__test__'
import Form from './form'
import createControl from './create-control'

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
        init: {},
        fields: {},
        values: {},
        touched: {}
      })
    })

    it('reads its initial values from props', () => {
      const values = { foo: '', bar: '' }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      expect(form.state).to.deep.equal({
        fields: {},
        touched: {},
        values,
        init: values
      })
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
        fields: {},
        touched: {},
        values,
        init: values
      })
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
        fields: {},
        touched: {},
        values,
        init: values
      })
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
        fields: { foo: field },
        values: { foo: 'foo' },
        init: { foo: 'foo' },
        touched: {}
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
        fields: { foo: field },
        values: { foo: 'bar' },
        init: { foo: '' },
        touched: {}
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
        fields: { foo: field },
        values: { foo: '' },
        init: { foo: '' },
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

    it('is touched if any of its descendant fields are touched', () => {
      const wrapper = mount(<Form/>)
      const form = wrapper.instance()
      const fieldSet = form.registerFieldSet({ paths: toThunks('foo') })
      const bar = form.registerField({
        paths: toThunks('foo.bar'),
        value: ''
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
      const fieldArray = form.registerFieldArray({
        paths: toThunks('foo')
      })
      expect(fieldArray).to.deep.equal({
        fields: [],
        length: 0,
        init: [],
        value: [],
        isTouched: false,
        isDirty: false,
        isPristine: true
      })
    })

    it('is touched if any of its descendant fields are touched', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const fieldArray = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const bar = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bar.update({ isTouched: true })
      expect(fieldArray.isTouched).to.equal(true)
    })

    it('is dirty if any of its descendant fields are dirty', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const fieldArray = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const bar = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bar.update({ value: 'baz' })
      expect(fieldArray.isDirty).to.equal(true)
      expect(fieldArray.isPristine).to.equal(false)
    })

    it('"pushes" a new field into an array', () => {
      const values = { foo: [''] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const bar = form.registerField({
        paths: toThunks('foo.0'),
        value: ''
      })
      bars.push('bar')
      expect(form.state).to.deep.equal({
        fields: { foo: [bar] },
        init: { foo: ['', 'bar'] },
        values: { foo: ['', 'bar'] },
        touched: {}
      })
    })

    it('"pops" a field from an array', () => {
      const values = { foo: [{ bar: 'baz' }, { bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const first = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      const second = form.registerField({
        paths: toThunks('foo.1.bar')
      })
      bars.pop()
      expect(form.state).to.deep.equal({
        fields: { foo: [{ bar: first }, { bar: second }] },
        init: { foo: [{ bar: 'baz' }] },
        values: { foo: [{ bar: 'baz' }] },
        touched: {}
      })
    })

    it('"unshifts" a new field into an array', () => {
      const values = { foo: [{ bar: '' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const first = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      bars.unshift({ bar: '' })
      expect(form.state).to.deep.equal({
        fields: { foo: [{ bar: first }] },
        init: { foo: [{ bar: '' }, { bar: '' }] },
        values: { foo: [{ bar: '' }, { bar: '' }] },
        touched: {}
      })
    })

    it('"shift"s a field from an array', () => {
      const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
      const wrapper = mount(<Form values={values}/>)
      const form = wrapper.instance()
      const bars = form.registerFieldArray({
        paths: toThunks('foo')
      })
      const first = form.registerField({
        paths: toThunks('foo.0.bar')
      })
      const second = form.registerField({
        paths: toThunks('foo.1.bar')
      })
      bars.shift()
      expect(form.state).to.deep.equal({
        fields: { foo: [{ bar: first }, { bar: second }] },
        init: { foo: [{ bar: 'baz' }] },
        values: { foo: [{ bar: 'baz' }] },
        touched: {}
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

  describe('onSubmit', () => {

    it('does nothing by default', () => {
      const wrapper = mount(<Form/>)
      wrapper.simulate('submit')
    })

    it('calls a submit handler prop with its values', done => {
      const values = { foo: 'bar' }
      const handleSubmit = submitted => {
        expect(submitted).not.to.equal(values)
        expect(submitted).to.deep.equal(values)
        done()
      }
      const wrapper = mount(
        <Form values={values} onSubmit={handleSubmit}/>
      )
      wrapper.simulate('submit')
    })

  })

  describe('onReset', () => {

    it('resets to its initial state', () => {
      const Input = createControl(({ control }) =>
        <input {...control}/>
      )({
        defaultProps: {
          value: ''
        }
      })
      const wrapper = mount(
        <Form values={{ foo: '' }}>
          <Input name='foo'/>
        </Form>
      )
      wrapper.find(Input)
        .simulate('change', { target: { value: 'foo' } })
        .simulate('blur')
      wrapper.simulate('reset')
      expect(wrapper.state()).to.deep.equal({
        touched: {},
        init: { foo: '' },
        values: { foo: '' },
        fields: {
          foo: {
            init: '',
            value: '',
            isTouched: false,
            isDirty: false,
            isPristine: true
          }
        }
      })
    })

  })

})
