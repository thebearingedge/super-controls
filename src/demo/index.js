import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
import Input from '../input'
import Checkbox from '../checkbox'
import Radio from '../radio'
import RadioGroup from '../radio-group'
import Select from '../select'
import TextArea from '../text-area'

const handleSubmit = values => {
  console.log(JSON.stringify(values, null, 2))
}

render(
  <div className='container'>
    <div className='row'>
      <div className='col-md-4 offset-md-4'>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <Input id name='name' type='text' className='form-control' autoFocus/>
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <Input id name='email' type='email' className='form-control'/>
            </div>
          </fieldset>
          <div className='form-group'>
            <label htmlFor='referral'>How&apos;d you hear about us?</label>
            <Select id name='referral' className='form-control'>
              <option label='Choose one...'/>
              <option value='1' label='Stack Overflow Careers'/>
              <option value='2' label='Angel List'/>
              <option value='3' label='LinkedIn'/>
            </Select>
          </div>
          <div className='form-group'>
            <label>What role are you interested in?</label>
            <RadioGroup name='role'>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='engineer' className='form-check-input'/>
                  Engineer
                </label>
              </div>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='developer' className='form-check-input'/>
                  Developer
                </label>
              </div>
              <div className='form-check'>
                <label className='form-check-label'>
                  <Radio value='designer' className='form-check-input'/>
                  Designer
                </label>
              </div>
            </RadioGroup>
          </div>
          <div className='form-group'>
            <label htmlFor='monad'>What is a monad? Give examples.</label>
            <TextArea id name='monad' className='form-control'/>
          </div>
          <div className='form-check'>
            <label className='form-check-label'>
              <Checkbox checked name='isCandidate' className='form-check-input'/>
              I want the job.
            </label>
          </div>
          <button type='submit' className='btn btn-primary'>Apply</button>
        </Form>
      </div>
    </div>
  </div>,
  document.querySelector('#app')
)
