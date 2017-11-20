import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
import Text from '../text'
import Radio from '../radio'
import RadioGroup from '../radio-group'
import SelectMultiple from '../select-multiple'
import FieldSet from '../field-set'

const handleSubmit = values =>
  console.log(JSON.stringify(values, null, 2))

render(
  <Form onSubmit={handleSubmit} className='container'>
    <div className='row'>
      <div className='col-md-6 offset-md-3'>
        <FieldSet name='fieldSet'>
          <div className='form-group'>
            <RadioGroup name='radioButtons'>
              <legend><small>Radio Group Lives Again</small></legend>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='foo' className='form-check-input' />
                  Foo
                </label>
              </div>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='bar' className='form-check-input'/>
                  Bar
                </label>
              </div>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='baz' className='form-check-input'/>
                  Baz
                </label>
              </div>
            </RadioGroup>
          </div>
          <div className='form-group'>
            <label htmlFor='textInput'>My Bootstrap Input</label>
            <Text id name='textInput' className='form-control'/>
          </div>
          <div className='form-group'>
            <label htmlFor='selectMultiple'>Monads</label>
            <FieldSet name='nested'>
              <SelectMultiple id name='selectMultiple' className='form-control'>
                <option value="io">IO</option>
                <option value="list">List</option>
                <option value="maybe">Maybe</option>
                <option value="state">State</option>
              </SelectMultiple>
            </FieldSet>
          </div>
        </FieldSet>
        <button type='submit' className='btn btn-primary'>Submit</button>
        <button type='reset' className='btn btn-outline-secondary'>Reset</button>
      </div>
    </div>
  </Form>,
  document.querySelector('#app')
)
