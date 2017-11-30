import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
import Text from '../text'
import Input from '../input'
import FieldSet from '../field-set'

const handleSubmit = values =>
  console.log(JSON.stringify(values, null, 2))

const values = {
  user: {
    credentials: {
      username: 'foo',
      password: 'bar'
    },
    contactInfo: {
      email: 'foo@bar.baz',
      phone: '800-800-8000'
    }
  }
}

render(
  <Form onSubmit={handleSubmit} values={values} className='container'>
    <FieldSet name='user'>
      <legend>User</legend>
      <FieldSet name='credentials'>
        <legend><small>Credentials</small></legend>
        <hr/>
        <div className='form-group'>
          <label htmlFor='username'>Username</label>
          <Text id name='username' className='form-control'/>
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <Input type='password' id name='password' className='form-control'/>
        </div>
      </FieldSet>
      <FieldSet name='contactInfo'>
        <legend><small>Contact Info</small></legend>
        <hr/>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <Text id name='email' className='form-control'/>
        </div>
        <div className='form-group'>
          <label htmlFor='phone'>Phone</label>
          <Input type='phone' id name='phone' className='form-control'/>
        </div>
      </FieldSet>
    </FieldSet>
    <button type='reset' className='btn btn-outline-secondary'>
      Reset
    </button>
    { ' ' }
    <button type='submit' className='btn btn-primary'>
      Submit
    </button>
  </Form>,
  document.querySelector('#app')
)
