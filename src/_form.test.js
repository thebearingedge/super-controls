import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, stub } from './__test__'
import Form from './_form'
import { toPaths } from './_util'

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

  it('gives state properties to fields', () => {
    const wrapper = mount(<Form values={{ foo: ['bar', 'baz'] }}/>)
    expect(wrapper.instance())
      .to.have.property('fields')
      .that.deep.equals({
        foo: {
          init: ['bar', 'baz'],
          value: ['bar', 'baz'],
          isTouched: false,
          isDirty: false,
          isPristine: true
        }
      })
  })

  it('receives value updates from fields', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.values)
          .to.deep.equal({ foo: '', bar: 'bar' })
        done()
      }
    }
    const wrapper = mount(<TestForm values={{ foo: '', bar: '' }}/>)
    const { bar } = wrapper.instance().fields
    bar.update({ value: 'bar' })
  })

  it('receives touch updates from fields', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.touched)
          .to.deep.equal({ foo: false, bar: true })
        done()
      }
    }
    const wrapper = mount(<TestForm values={{ foo: '', bar: '' }}/>)
    const { bar } = wrapper.instance().fields
    bar.update({ isTouched: true })
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

  it('gives state properties to nested fields', () => {
    const values = {
      foo: {
        bar: {
          baz: ''
        }
      }
    }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    expect(form.fields).to.deep.equal({
      foo: {
        bar: {
          baz: {
            init: '',
            value: '',
            isTouched: false,
            isDirty: false,
            isPristine: true
          }
        }
      }
    })
  })

  it('receives value updates from nested fields', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.values).to.deep.equal({
          foo: {
            bar: {
              baz: 'baz'
            }
          }
        })
        done()
      }
    }
    const values = {
      foo: {
        bar: {
          baz: ''
        }
      }
    }
    const wrapper = mount(<TestForm values={values}/>)
    const baz = wrapper.instance().fields.foo.bar.baz
    baz.update({ value: 'baz' })
  })

  it('receives touch updates from nested fields', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.touched).to.deep.equal({
          foo: {
            bar: {
              baz: true
            }
          }
        })
        done()
      }
    }
    const values = {
      foo: {
        bar: {
          baz: ''
        }
      }
    }
    const wrapper = mount(<TestForm values={values}/>)
    const baz = wrapper.instance().fields.foo.bar.baz
    baz.update({ isTouched: true })
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

  it('gives state properties to fields in arrays', () => {
    const values = {
      foo: [
        { bar: '' },
        { bar: '' }
      ]
    }
    const wrapper = mount(<Form values={values}/>)
    expect(wrapper.instance())
      .to.have.property('fields')
      .that.deep.equals({
        foo: [
          {
            bar: {
              init: '',
              value: '',
              isTouched: false,
              isDirty: false,
              isPristine: true
            }
          },
          {
            bar: {
              init: '',
              value: '',
              isTouched: false,
              isDirty: false,
              isPristine: true
            }
          }
        ]
      })
  })

  it('receives value updates from fields in arrays', done => {
    const values = {
      foo: [
        { bar: '' },
        { bar: '' }
      ]
    }
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.values).to.deep.equal({
          foo: [
            { bar: '' },
            { bar: 'bar' }
          ]
        })
        done()
      }
    }
    const wrapper = mount(<TestForm values={values}/>)
    const [ , { bar } ] = wrapper.instance().fields.foo
    bar.update({ value: 'bar' })
  })

  it('receives touch updates from fields in arrays', done => {
    const values = {
      foo: [
        { bar: '' },
        { bar: '' }
      ]
    }
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state.touched).to.deep.equal({
          foo: [
            { bar: false },
            { bar: true }
          ]
        })
        done()
      }
    }
    const wrapper = mount(<TestForm values={values}/>)
    const [ , { bar } ] = wrapper.instance().fields.foo
    bar.update({ isTouched: true })
  })

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
      paths: toPaths('foo.bar.baz.0.qux')
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
    form.registerField({ paths: toPaths('foo'), value: 'foo' })
  })

  it('registers new nested fields', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state).to.deep.equal({
          values: { foo: { bar: 'bar' } },
          touched: { foo: { bar: false } }
        })
        expect(this.fields.foo.bar).to.deep.equal({
          init: 'bar',
          value: 'bar',
          isTouched: false,
          isDirty: false,
          isPristine: true
        })
        done()
      }
    }
    const wrapper = mount(<TestForm/>)
    const form = wrapper.instance()
    form.registerField({ paths: toPaths('foo.bar'), value: 'bar' })
  })

  it('registers new fields in arrays', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.state).to.deep.equal({
          values: { foo: [{ bar: 'bar' }] },
          touched: { foo: [{ bar: false }] }
        })
        expect(this.fields.foo).to.deep.equal([
          {
            bar: {
              init: 'bar',
              value: 'bar',
              isTouched: false,
              isDirty: false,
              isPristine: true
            }
          }
        ])
        done()
      }
    }
    const wrapper = mount(<TestForm/>)
    const form = wrapper.instance()
    form.registerField({ paths: toPaths('foo.0.bar'), value: 'bar' })
  })

  it('returns a field set wrapper', () => {
    const values = { foo: { bar: '' } }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const field = form.registerFieldSet({ paths: toPaths('foo'), value: {} })
    expect(field).to.deep.equal({
      init: { bar: '' },
      value: { bar: '' },
      isTouched: false,
      isDirty: false,
      isPristine: true,
      fields: form.fields.foo
    })
  })

  it('creates nested fields and returns a field set wrapper', () => {
    const wrapper = mount(<Form/>)
    const form = wrapper.instance()
    const field = form.registerFieldSet({
      paths: toPaths('foo'),
      value: { bar: '' }
    })
    expect(field).to.deep.equal({
      init: { bar: '' },
      value: { bar: '' },
      isTouched: false,
      isDirty: false,
      isPristine: true,
      fields: form.fields.foo
    })
    expect(form.state).to.deep.equal({
      values: {
        foo: { bar: '' }
      },
      touched: {
        foo: { bar: false }
      }
    })
    expect(form.fields).to.deep.equal({
      foo: {
        bar: {
          init: '',
          value: '',
          isTouched: false,
          isDirty: false,
          isPristine: true
        }
      }
    })
  })

  it('returns a field array wrapper', () => {
    const wrapper = mount(<Form/>)
    const form = wrapper.instance()
    const field = form.registerFieldArray({
      paths: toPaths('foo'),
      value: []
    })
    expect(field).to.deep.equal({
      length: 0,
      init: [],
      value: [],
      isTouched: false,
      isDirty: false,
      isPristine: true,
      fields: form.fields.foo
    })
  })

  it('creates nested fields and returns a field array wrapper', () => {
    const wrapper = mount(<Form/>)
    const form = wrapper.instance()
    const field = form.registerFieldArray({
      paths: toPaths('foo'),
      value: [{ bar: '' }, { bar: '' }]
    })
    expect(field).to.deep.equal({
      length: 2,
      init: [{ bar: '' }, { bar: '' }],
      value: [{ bar: '' }, { bar: '' }],
      isTouched: false,
      isDirty: false,
      isPristine: true,
      fields: form.fields.foo
    })
    expect(form.state).to.deep.equal({
      values: {
        foo: [{ bar: '' }, { bar: '' }]
      },
      touched: {
        foo: [{ bar: false }, { bar: false }]
      }
    })
    expect(form.fields).to.deep.equal({
      foo: [
        {
          bar: {
            init: '',
            value: '',
            isTouched: false,
            isDirty: false,
            isPristine: true
          }
        },
        {
          bar: {
            init: '',
            value: '',
            isTouched: false,
            isDirty: false,
            isPristine: true
          }
        }
      ]
    })
  })

  it('"pushes" a new field into an array', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.fields.foo[1]).to.deep.equal({
          bar: {
            init: 'baz',
            value: 'baz',
            isTouched: false,
            isDirty: false,
            isPristine: true
          }
        })
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
    const bars = form.registerFieldArray({ paths: toPaths('foo'), value: [] })
    bars.push({ bar: 'baz' })
  })

  it('"pops" a field from an array', done => {
    class TestForm extends Form {
      componentDidUpdate() {}
    }
    const values = { foo: [{ bar: '' }, { bar: '' }] }
    const wrapper = mount(<TestForm values={values}/>)
    const form = wrapper.instance()
    stub(form, 'componentDidUpdate')
      .callsFake(() => {
        expect(form.fields.foo).to.deep.equal([
          {
            bar: {
              init: '',
              value: '',
              isTouched: false,
              isDirty: false,
              isPristine: true
            }
          }
        ])
        done()
      })
    const bars = form.registerFieldArray({ paths: toPaths('foo'), value: [] })
    bars.pop()
  })

  it('"unshifts" a new field into an array', () => {
    const values = { foo: [] }
    const wrapper = mount(<Form values={values}/>)
    const form = wrapper.instance()
    const bars = form.registerFieldArray({ paths: toPaths('foo'), value: [] })
    bars.unshift({ bar: '' })
    expect(form.fields.foo).to.deep.equal([
      {
        bar: {
          init: '',
          value: '',
          isTouched: false,
          isDirty: false,
          isPristine: true
        }
      }
    ])
    expect(form.state).to.deep.equal({
      values: { foo: [{ bar: '' }] },
      touched: { foo: [{ bar: false }] }
    })
  })

  it('"shift"s a field from an array', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(this.fields.foo).to.deep.equal([
          {
            bar: {
              init: 'baz',
              value: 'baz',
              isTouched: false,
              isDirty: false,
              isPristine: true
            }
          }
        ])
        done()
      }
    }
    const values = { foo: [{ bar: '' }, { bar: 'baz' }] }
    const wrapper = mount(<TestForm values={values}/>)
    const form = wrapper.instance()
    const bars = form.registerFieldArray({ paths: toPaths('foo'), value: [] })
    bars.shift()
  })

})
