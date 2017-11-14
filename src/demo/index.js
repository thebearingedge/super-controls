import React from 'react'
import { render } from 'react-dom'
import Text from '../text'
import Form from '../form'

render(
  <Form>
    <div className='form-group'>
      <label htmlFor='foo'>My Bootstrap Input</label>
      <Text id name='foo' className='form-control'/>
    </div>
  </Form>,
  document.querySelector('#app')
)
