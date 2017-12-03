import React from 'react'
import { object } from 'prop-types'
import { describe, it } from 'mocha'
import { mount, expect, stub, spy, toThunks } from './__test__'
import { Form } from './form'
import { Field, modelField } from './field'
import { FieldSet } from './field-set'
import { FieldArray, modelFieldArray } from './field-array'

describe('FieldArray', () => {

  it('registers a field array model', done => {
    class TestFieldArray extends FieldArray {
      componentDidMount() {
        expect(this.model).to.be.an('object')
        done()
      }
    }
    mount(
      <Form>
        <TestFieldArray name='foos'/>
      </Form>
    )
  })

  it('unregisters its model when it unmounts', () => {
    let model
    class TestFieldArray extends FieldArray {
      componentDidMount() {
        model = this.model
      }
    }
    const wrapper = mount(
      <Form>
        <TestFieldArray name='foo'/>
      </Form>
    )
    const unregister = spy(model, 'unregister')
    wrapper.unmount()
    expect(unregister).to.have.callCount(1)
  })

  it('renders a component prop', () => {
    const wrapper = mount(
      <Form>
        <FieldArray name='foos' component={_ => <noscript/>}/>
      </Form>
    )
    expect(wrapper).to.contain(<noscript/>)
  })

  it('renders a function child', () => {
    const wrapper = mount(
      <Form>
        <FieldArray name='foos'>
          { _ => <noscript/> }
        </FieldArray>
      </Form>
    )
    expect(wrapper).to.contain(<noscript/>)
  })

  it('namespaces descendant fields', done => {
    class TestField extends Field {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0])
        done()
      }
    }
    mount(
      <Form values={{ foos: [''] }}>
        <FieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <TestField name={index} key={index}/>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant field sets', done => {
    class TestFieldSet extends FieldSet {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0])
        done()
      }
    }
    mount(
      <Form values={{ foos: [{}] }}>
        <FieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <TestFieldSet name={index} key={index}/>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('namespaces descendant field arrays', done => {
    class TestFieldArray extends FieldArray {
      componentDidMount() {
        expect(this.model.path).to.deep.equal(['foos', 0])
        done()
      }
    }
    mount(
      <Form values={{ foos: [[]] }}>
        <FieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <TestFieldArray name={index} key={index}/>
            )
          }
        </FieldArray>
      </Form>
    )
  })

  it('tracks touches of its descendant fields', done => {
    const Input = ({ control }) => <input {...control}/>
    Input.propTypes = { control: object }
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {}
    }
    const wrapper = mount(
      <Form values={{ foos: [''] }}>
        <TestFieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <Field name={index} key={index} component={Input}/>
            )
          }
        </TestFieldArray>
      </Form>
    )
    stub(TestFieldArray.prototype, 'componentDidUpdate')
      .callsFake(() => done())
    wrapper.find(Input).simulate('blur')
  })

})

describe('modelFieldArray', () => {

  it('returns a field array wrapper', () => {
    const values = { foo: [] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const model = form.register({
      init: [],
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    expect(model).to.deep.equal({
      init: [],
      value: [],
      length: 0,
      isTouched: false,
      isDirty: false,
      isPristine: true
    })
  })

  it('is touched if any of its descendant fields are touched', done => {
    const wrapper = mount(<Form/>)
    const form = wrapper.instance()
    const model = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    wrapper.setState({
      touched: {
        foo: [{ bar: [true] }]
      }
    }, _ => {
      expect(model.isTouched).to.equal(true)
      done()
    })
  })

  it('isDirty if any of its descendant fields are dirty', done => {
    const wrapper = mount(<Form values={{ foo: [{ bar: 'baz' }] }}/>)
    const form = wrapper.instance()
    const model = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    wrapper.setState({
      values: {
        foo: [{ bar: 'qux' }]
      }
    }, _ => {
      expect(model).to.include({
        isDirty: true,
        isPristine: false
      })
      done()
    })
  })

  it('"pushes" a new field into an array', () => {
    const values = { foo: [''] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0'),
      value: ''
    })
    bars.push('bar')
    expect(form.state).to.deep.equal({
      init: { foo: ['', 'bar'] },
      values: { foo: ['', 'bar'] },
      touched: { foo: [void 0, void 0] }
    })
  })

  it('"pops" a field from an array', () => {
    const values = { foo: [{ bar: 'baz' }, { bar: '' }] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.1.bar')
    })
    bars.pop()
    expect(form.state).to.deep.equal({
      init: { foo: [{ bar: 'baz' }] },
      values: { foo: [{ bar: 'baz' }] },
      touched: { foo: [] }
    })
  })

  it('"unshifts" a new field into an array', () => {
    const values = { foo: [{ bar: '' }] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    bars.unshift({ bar: '' })
    expect(form.state).to.deep.equal({
      init: { foo: [{ bar: '' }, { bar: '' }] },
      values: { foo: [{ bar: '' }, { bar: '' }] },
      touched: { foo: [void 0] }
    })
  })

  it('"shift"s a field from an array', () => {
    const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.1.bar')
    })
    bars.shift()
    expect(form.state).to.deep.equal({
      init: { foo: [{ bar: 'baz' }] },
      values: { foo: [{ bar: 'baz' }] },
      touched: { foo: [] }
    })
  })

  it('"maps" over its values', () => {
    const values = { foo: [{ bar: '' }, { bar: '' }, { bar: '' }] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    const mapped = bars.map((bar, index, _bars) => {
      expect(bar).to.deep.equal({ bar: '' })
      expect(index).to.be.a('number')
      expect(_bars).to.equal(bars)
      return bar
    })
    expect(mapped).to.deep.equal(values.foo)
  })

})
