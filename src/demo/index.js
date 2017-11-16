import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
import Text from '../text'
import Radio from '../radio'
import RadioGroup from '../radio-group'
import SelectMultiple from '../select-multiple'

const handleSubmit = values =>
  console.log(JSON.stringify(values, null, 2))

const initialValues = { foo: 'bar', corge: 'grault', waldo: [] }

render(
  <Form onSubmit={handleSubmit} values={initialValues} className='container'>
    <div className='row'>
      <div className='col-md-6 offset-md-3'>
        <fieldset className='form-group'>
          <RadioGroup name='foo'>
            <legend>Radio Group Lives Again</legend>
            <div className='form-check'>
              <label className='form-check-label'>
                <Radio value='bar' className='form-check-input' />
                Bar
              </label>
            </div>
            <div className='form-check'>
              <label className='form-check-label'>
                <Radio value='baz' className='form-check-input'/>
                Baz
              </label>
            </div>
            <div className='form-check'>
              <label className='form-check-label'>
                <Radio value='qux' className='form-check-input'/>
                Qux
              </label>
            </div>
          </RadioGroup>
        </fieldset>
        <div className='form-group'>
          <label htmlFor='corge'>My Bootstrap Input</label>
          <Text id name='corge' className='form-control'/>
        </div>
        <div className='form-group'>
          <label htmlFor='waldo'>Monads</label>
          <SelectMultiple id name='waldo' className='form-control'>
            <option value="io">IO</option>
            <option value="list">List</option>
            <option value="maybe">Maybe</option>
            <option value="state">State</option>
          </SelectMultiple>
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
        <button type='reset' className='btn btn-outline-secondary'>Reset</button>
      </div>
    </div>
  </Form>,
  document.querySelector('#app')
)
