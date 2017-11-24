import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
import Text from '../text'
import Radio from '../radio'
import RadioGroup from '../radio-group'
import SelectMultiple from '../select-multiple'
import FieldSet from '../field-set'
import FieldArray from '../field-array'

const handleSubmit = values =>
  console.log(JSON.stringify(values, null, 2))

const values = {
  radioButtons: 'bar',
  fieldSet: {
    textInput: 'It has a "form-control" class!',
    nested: {
      selectMultiple: [
        'io',
        'maybe'
      ]
    },
    fieldArray: [
      { name: 'clive' },
      { name: 'nutmeg' },
      { name: 'briscoe' }
    ]
  }
}

render(
  <Form onSubmit={handleSubmit} values={values} className='container'>
    <div className='row'>
      <div className='col-md-8 offset-md-2'>
        <div className='form-group'>
          <RadioGroup name='radioButtons'>
            <label>Radio Group Lives Again</label>
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
        <FieldSet name='fieldSet'>
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
          <FieldArray name='fieldArray'>
            { pets =>
              <div className='form-group'>
                <label>List Your Pets</label>
                <div className='form-group'>
                  { !!pets.length &&
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => pets.shift()}>
                      Shift
                    </button>
                  }
                  { ' ' }
                  <button
                    type='button'
                    className='btn btn-success'
                    onClick={() => pets.unshift({ name: '' })}>
                    Unshift
                  </button>
                </div>
                { pets.map((pet, index, key) =>
                  <FieldSet name={index} key={key}>
                    <div className='form-group'>
                      <Text
                        name='name'
                        className='form-control'
                        placeholder='Name'/>
                    </div>
                  </FieldSet>
                )}
                { !!pets.length &&
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => pets.pop()}>
                    Pop
                  </button>
                }
                { ' ' }
                <button
                  type='button'
                  className='btn btn-success'
                  onClick={() => pets.push({ name: '' })}>
                  Push
                </button>
              </div>
            }
          </FieldArray>
        </FieldSet>
        <button type='submit' className='btn btn-primary'>Submit</button>
        { ' ' }
        <button type='reset' className='btn btn-outline-secondary'>Reset</button>
      </div>
    </div>
  </Form>,
  document.querySelector('#app')
)
