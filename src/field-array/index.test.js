import React from 'react'
import { describe, beforeEach, it } from 'mocha'
import { mount, expect, stub, spy, mockField } from '../__test__'
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

  it('models a field for each value in its own field', () => {
    registerField
      .returns(mockField([
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]))
    const fieldArray = mount(
      <FieldArray name='test'/>,
      { context }
    )
    const { fieldSets: [ first, second ] } = fieldArray.instance()
    expect(first.type)
      .to.have.property('state')
      .that.deep.equals({
        isTouched: false, isDirty: false, value: 'cat', init: 'cat'
      })
    expect(first.name)
      .to.have.property('state')
      .that.deep.equals({
        isTouched: false, isDirty: false, value: 'clive', init: 'clive'
      })
    expect(second.type)
      .to.have.property('state')
      .that.deep.equals({
        isTouched: false, isDirty: false, value: 'rat', init: 'rat'
      })
    expect(second.name)
      .to.have.property('state')
      .that.deep.equals({
        isTouched: false, isDirty: false, value: 'nutmeg', init: 'nutmeg'
      })
  })

  it('pushes a fieldSet model into its fieldSets', () => {
    const field = mockField([
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ])
    registerField.returns(field)
    const fieldArray = mount(
      <FieldArray name='test'/>,
      { context }
    )
    const update = spy(field, 'update')
    const { array, fieldSets } = fieldArray.instance()
    array.push({ type: 'dog', name: 'briscoe' })
    expect(fieldSets).to.have.lengthOf(3)
    expect(update).to.have.been.calledWith({
      value: [
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' },
        { type: 'dog', name: 'briscoe' }
      ]
    })
  })

  it('pops a fieldSet model from its fieldSets', () => {
    const field = mockField([
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ])
    registerField.returns(field)
    const fieldArray = mount(
      <FieldArray name='test'/>,
      { context }
    )
    const update = spy(field, 'update')
    const { array, fieldSets } = fieldArray.instance()
    array.pop()
    expect(fieldSets).to.have.lengthOf(1)
    expect(update).to.have.been.calledWith({
      value: [{ type: 'cat', name: 'clive' }]
    })
  })

  it('unshifts a fieldSet model into its fieldSets', () => {
    const field = mockField([
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ])
    registerField.returns(field)
    const fieldArray = mount(
      <FieldArray name='test'/>,
      { context }
    )
    const update = spy(field, 'update')
    const { array, fieldSets } = fieldArray.instance()
    array.unshift({ type: 'dog', name: 'briscoe' })
    expect(fieldSets).to.have.lengthOf(3)
    expect(update).to.have.been.calledWith({
      value: [
        { type: 'dog', name: 'briscoe' },
        { type: 'cat', name: 'clive' },
        { type: 'rat', name: 'nutmeg' }
      ]
    })
  })

  it('shifts a fieldSet model from its fieldSets', () => {
    const field = mockField([
      { type: 'cat', name: 'clive' },
      { type: 'rat', name: 'nutmeg' }
    ])
    registerField.returns(field)
    const fieldArray = mount(
      <FieldArray name='test'/>,
      { context }
    )
    const update = spy(field, 'update')
    const { array, fieldSets } = fieldArray.instance()
    array.shift()
    expect(fieldSets).to.have.lengthOf(1)
    expect(update).to.have.been.calledWith({
      value: [{ type: 'rat', name: 'nutmeg' }]
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
          pets.map((pet, index, key) => <FieldSet name={index} key={key}/>)
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
