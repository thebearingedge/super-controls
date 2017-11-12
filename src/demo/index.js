import React from 'react'
import { render } from 'react-dom'
import Form from '../form'
// import Input from '../input'
// import Checkbox from '../checkbox'
// import Radio from '../radio'
// import RadioGroup from '../radio-group'
// import Select from '../select'
// import TextArea from '../text-area'
import field from '../field'
import controlled from '../controlled'

const Input = field(controlled(({ name, label, ...props }) =>
  <div className='form-group'>
    <label htmlFor={name}>{ label }</label>
    <input name={name} className='form-control' {...props}/>
  </div>
))({
  displayName: 'Input',
  defaultProps: { value: '' }
})

const Select = field(controlled(({ name, label, children, ...props }) =>
  <div className='form-group'>
    <label htmlFor={name}>{ label }</label>
    <select name={name} className='form-control' {...props}>
      { children }
    </select>
  </div>
))({
  displayName: 'Select',
  defaultProps: { value: '' }
})

const Radio = field(controlled(({ children, ...props }) =>
  <div className='form-check'>
    <label className='form-check-label'>
      <input type='radio' className='form-check-input' {...props}/>
      { children }
    </label>
  </div>
))({
  displayName: 'Radio',
  defaultProps: { checked: false }
})

const TextArea = field(controlled(({ name, label, ...props }) =>
  <div className='form-group'>
    <label htmlFor={name}>{ label }</label>
    <textarea id={name} name={name} className='form-control' {...props}/>
  </div>
))({
  displayName: 'TextArea',
  defaultProps: { value: '' }
})

const Checkbox = field(controlled(({ name, label, ...props }) =>
  <div className='form-check'>
    <label className='form-check-label'>
      <input name={name} type='checkbox' className='form-check-input' {...props}/>
      { label }
    </label>
  </div>
))({
  displayName: 'Checkbox',
  defaultProps: {
    checked: false
  }
})

const handleSubmit = values => {
  console.log(JSON.stringify(values, null, 2))
}

const form = (
  <Form onSubmit={handleSubmit}>
    <Input id type='text' name='name' label='Name'/>
    <Input id type='email' name='email' label='Email'/>
    <Select id name='referral' label='How did you hear about us?'>
      <option label='Choose one...'/>
      <option value='1' label='Stack Overflow Careers'/>
      <option value='2' label='Angel List'/>
      <option value='3' label='LinkedIn'/>
    </Select>
    <div className='form-group'>
      <label>What role are you interested in?</label>
      <Radio name='role' value='engineer'>
        Engineer
      </Radio>
      <Radio name='role' value='developer'>
        Developer
      </Radio>
      <Radio name='role' value='designer'>
        Designer
      </Radio>
    </div>
    <TextArea id name='monad' label='What is a monad? Give examples.'/>
    <Checkbox name='isCandidate' label='I want the job.'/>
    <button type='submit' className='btn btn-primary'>Apply</button>
  </Form>
)

render(
  <div className='container'>
    <div className='row'>
      <div className='col-md-4 offset-md-4'>
        { form }
      </div>
    </div>
  </div>,
  document.querySelector('#app')
)
