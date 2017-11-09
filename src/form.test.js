import React from 'react'
import { describe, it } from 'mocha'
import { mount, expect, spy } from './__test__'
import Form from './form'
import Checkbox from './checkbox'

describe('Form', () => {

  it('renders a form element', () => {
    const form = mount(<Form/>)
    expect(form).to.have.tagName('form')
  })

  it('gets its state values from props', () => {
    const values = { test: true }
    const form = mount(<Form values={values}/>)
    expect(form)
      .to.have.state('values')
      .that.deep.equals({ test: true })
  })

  it('calls a submit handler with its values', () => {
    const values = {}
    const handleSubmit = spy()
    const form = mount(<Form values={values} onSubmit={handleSubmit}/>)
    form.find('form').simulate('submit')
    expect(handleSubmit).to.have.been.calledWith(values)
  })

  it('passes its control values via context', () => {
    const values = { test: true }
    const form = mount(
      <Form values={values}>
        <Checkbox name='test'/>
      </Form>
    )
    const checkbox = form.find('[type="checkbox"]')
    expect(checkbox).to.be.checked()
  })

  it('receives its control values via context', () => {
    const form = mount(
      <Form>
        <Checkbox name='foo'/>
        <Checkbox name='bar' checked/>
      </Form>
    )
    expect(form)
      .to.have.state('values')
      .that.deep.equals({ foo: false, bar: true })
  })

  it('updates its state values when children change', done => {
    class TestForm extends Form {
      componentDidUpdate() {
        expect(form)
          .to.have.state('values')
          .that.deep.equals({ test: false })
        done()
      }
    }
    const form = mount(
      <TestForm values={{ test: true }}>
        <Checkbox name='test'/>
      </TestForm>
    )
    const checkbox = form.find('[type="checkbox"]')
    const target = checkbox.getDOMNode()
    target.checked = false
    checkbox.simulate('change', { target })
  })

})
