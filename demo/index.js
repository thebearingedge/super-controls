import React from 'react'
import { render } from 'react-dom'
import { Form } from '../src/form'
import { Field } from '../src/field'
import { FieldSet } from '../src/field-set'
import { FieldArray } from '../src/field-array'

const handleSubmit = values =>
  console.log(JSON.stringify(values, null, 2))

const values = {
  username: 'foobar',
  contactInfo: {
    email: 'foo@bar.baz'
  },
  friends: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]
}

render(
  <Form
    name='signUp'
    values={values}
    onSubmit={handleSubmit}
    className='container'>
    <legend>Join Up!</legend>
    <div className='form-group'>
      <label htmlFor='username'>Username</label>
      <Field
        id
        type='text'
        name='username'
        component='input'
        className='form-control'/>
    </div>
    <FieldSet name='contactInfo' className='form-group'>
      <legend><small>Contact Info</small></legend>
      <label htmlFor='email'>Email</label>
      <Field
        id
        name='email'
        component='input'
        className='form-control'/>
    </FieldSet>
    <FieldArray name='friends'>
      { ({ fields }) =>
        <div className='form-group'>
          <legend><small>Friends ({ fields.length })</small></legend>
          { fields.map((friend, index) =>
            <FieldSet name={index} key={index}>
              <div className='input-group form-group'>
                <Field
                  type='text'
                  name='name'
                  component='input'
                  placeholder='Name'
                  className='form-control'/>
                <span className='input-group-btn'>
                  <button
                    type='button'
                    onClick={_ => fields.remove(index)}
                    className='btn btn-secondary'>
                    <i className='oi oi-x'/>
                  </button>
                </span>
              </div>
            </FieldSet>
          )}
          <button
            type='button'
            onClick={_ => fields.push({ name: '' })}
            className='btn btn-outline-success'>
            <i className='oi oi-plus'/>
          </button>
        </div>
      }
    </FieldArray>
    <button type='reset' className='btn btn-outline-secondary'>
      Reset
    </button>
    { ' ' }
    <button type='submit' className='btn btn-primary'>
      Sign Up
    </button>
  </Form>,
  document.querySelector('#app')
)
