import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, stub, spy, toThunks } from './__test__'
import { Form } from './form'
import { Field, modelField } from './field'
import { FieldSet, modelFieldSet } from './field-set'
import { FieldArray, modelFieldArray } from './field-array'

describe('FieldArray', () => {

  it('registers a field array model', done => {
    class TestFieldArray extends FieldArray {
      componentDidMount() {
        expect(this.model).to.deep.include({
          init: [],
          value: [],
          length: 0,
          touched: [],
          visited: [],
          isTouched: false
        })
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
      <Form init={{ foos: [''] }}>
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
      <Form init={{ foos: [{}] }}>
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
      <Form init={{ foos: [[]] }}>
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

  it('tracks updates to its value', done => {
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {}
    }
    const wrapper = mount(
      <Form init={{ foos: ['foo'] }}>
        <TestFieldArray name='foos'/>
      </Form>
    )
    stub(TestFieldArray.prototype, 'componentDidUpdate')
      .callsFake(() => done())
    wrapper.setState({ values: { foos: ['bar'] } })
  })

  it('tracks touches of its descendant fields', done => {
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {}
    }
    const wrapper = mount(
      <Form init={{ foos: [''] }}>
        <TestFieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <Field name={index} key={index} component='input'/>
            )
          }
        </TestFieldArray>
      </Form>
    )
    stub(TestFieldArray.prototype, 'componentDidUpdate')
      .callsFake(() => done())
    wrapper.find('input').simulate('blur')
  })

  it('tracks focuses of its descendant fields', done => {
    class TestFieldArray extends FieldArray {
      componentDidUpdate() {}
    }
    const wrapper = mount(
      <Form init={{ foos: [''] }}>
        <TestFieldArray name='foos'>
          { ({ fields }) =>
            fields.map((foo, index) =>
              <Field name={index} key={index} component='input'/>
            )
          }
        </TestFieldArray>
      </Form>
    )
    stub(TestFieldArray.prototype, 'componentDidUpdate')
      .callsFake(() => done())
    wrapper.find('input').simulate('focus')
  })

})

describe('modelFieldArray', () => {

  it('is touched if any of its descendant fields are touched', done => {
    const wrapper = mount(<Form init={{ foo: [] }}/>)
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

  it('"pushes" a new field into an array', () => {
    const values = { foo: [''] }
    const wrapper = mount(<Form init={values}/>)
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
    expect(form.state).to.deep.include({
      init: { foo: ['', 'bar'] },
      values: { foo: ['', 'bar'] },
      touched: { foo: [void 0, void 0] }
    })
  })

  it('"pops" a field from an array', () => {
    const values = { foo: [{ bar: 'baz' }, { bar: '' }] }
    const wrapper = mount(<Form init={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelFieldSet,
      paths: toThunks('foo.0')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    form.register({
      model: modelFieldSet,
      paths: toThunks('foo.1')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.1.bar')
    })
    bars.pop()
    expect(form.state).to.deep.include({
      touched: { foo: [] },
      init: { foo: [{ bar: 'baz' }] },
      values: { foo: [{ bar: 'baz' }] }
    })
  })

  it('"unshifts" a new field into an array', () => {
    const values = { foo: [{ bar: '' }] }
    const wrapper = mount(<Form init={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelFieldSet,
      paths: toThunks('foo.0')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    bars.unshift({ bar: '' })
    expect(form.state).to.deep.include({
      touched: { foo: [void 0] },
      init: { foo: [{ bar: '' }, { bar: '' }] },
      values: { foo: [{ bar: '' }, { bar: '' }] }
    })
  })

  it('"shift"s a field from an array', () => {
    const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
    const wrapper = mount(<Form init={values}/>)
    const form = wrapper.instance()
    const bars = form.register({
      model: modelFieldArray,
      paths: toThunks('foo')
    })
    form.register({
      model: modelFieldSet,
      paths: toThunks('foo.0')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.0.bar')
    })
    form.register({
      model: modelFieldSet,
      paths: toThunks('foo.1')
    })
    form.register({
      model: modelField,
      paths: toThunks('foo.1.bar')
    })
    bars.shift()
    expect(form.state).to.deep.include({
      touched: { foo: [] },
      init: { foo: [{ bar: 'baz' }] },
      values: { foo: [{ bar: 'baz' }] }
    })
  })

  it('"maps" over its values', () => {
    const values = { foo: [{ bar: '' }, { bar: '' }, { bar: '' }] }
    const wrapper = mount(<Form init={values}/>)
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
