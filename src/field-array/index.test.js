import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, mockField } from '../__test__'
import createControl from '../create-control'
import FieldArray from '.'
import FieldSet from '../field-set'

describe('FieldArray', () => {

  let context
  let registerField

  beforeEach(() => {
    context = { registerField() {} }
    registerField = stub(context, 'registerField')
  })

  it('registers itself via context', () => {
    registerField
      .returns(mockField([
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]))
    const wrapper = mount(
      <FieldArray name='test'/>,
      { context }
    )
    expect(wrapper).to.have.state('value').that.deep.equals([
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ])
  })

  it('registers an initial value', () => {
    registerField
      .returns(mockField([
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]))
    const value = [
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ]
    mount(
      <FieldArray name='test' value={value}/>,
      { context }
    )
    expect(registerField).to.have.been.calledWith({
      name: 'test',
      value: [
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]
    })
  })

  it('renders an array of FieldSets', () => {
    registerField
      .returns(mockField([
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]))
    const wrapper = mount(
      <FieldArray name='test'>
        { pets =>
          pets.map((_, index) =>
            <FieldSet name={index} key={index}></FieldSet>
          )
        }
      </FieldArray>,
      { context }
    )
    expect(wrapper.find(FieldSet)).to.have.lengthOf(2)
  })

  it('registers the fields within each FieldSet', () => {
    registerField
      .returns(mockField([
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]))
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )({
      displayName: 'Input'
    })
    const wrapper = mount(
      <FieldArray name='test'>
        { pets =>
          pets.map((pet, i) =>
            <FieldSet name={i} key={i}>
              <Input name='type'/>
              <Input name='name'/>
            </FieldSet>
          )
        }
      </FieldArray>,
      { context }
    )
    expect(wrapper.find(Input)).to.have.lengthOf(4)
  })

  it('receives updates from its controls', done => {
    registerField
      .returns(mockField([
        { name: 'clive' },
        { name: 'nutmeg' }
      ]))
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )({
      displayName: 'Input'
    })
    const wrapper = mount(
      <FieldArray name='test'>
        { pets =>
          pets.map((pet, i) =>
            <FieldSet name={i} key={i}>
              <Input name='name'/>
            </FieldSet>
          )
        }
      </FieldArray>,
      { context }
    )
    stub(wrapper.instance(), 'update')
      .withArgs(0, 'name', { value: 'peanut' })
      .callsFake(() => done())
    wrapper.find(Input).first().simulate('change', {
      target: { value: 'peanut' }
    })
  })

  it('sends updates to its field model', done => {
    const field = mockField([
      { name: 'clive' },
      { name: 'nutmeg' }
    ])
    registerField.returns(field)
    const Input = createControl(({ control }) =>
      <input {...control}/>
    )({
      displayName: 'Input'
    })
    const wrapper = mount(
      <FieldArray name='test'>
        { pets =>
          pets.map((pet, i) =>
            <FieldSet name={i} key={i}>
              <Input name='name'/>
            </FieldSet>
          )
        }
      </FieldArray>,
      { context }
    )
    stub(field, 'update')
      .withArgs({
        value: [{ 'name': 'clive' }, { 'name': 'sugar' }],
        isTouched: false
      })
      .callsFake(() => done())
    wrapper.find(Input).at(1).simulate('change', {
      target: { value: 'sugar' }
    })

  })

})
