/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { Form, Field, FieldSet, FieldArray } from '~/src'

const handleSubmit = (errors, values, form) => {
  if (errors) return form.touchAll()
  console.log(JSON.stringify(values, null, 2))
}

const validateUsername = value =>
  value.trim().length < 3 &&
  'Username must be at least 3 characters long.'

const notifyUsername = value =>
  value.length > 2 &&
  'That is a great username!'

const validateEmail = value =>
  !/\w+@\w+\.\w+/.test(value) && 'Please enter a valid email.'

const validateFriends = friends => {
  if (friends.some(friend => !friend.name.trim())) {
    return 'Please name each friend.'
  }
  if (friends.length < 3) {
    return 'Please name at least three friends.'
  }
}

const validateFriendName = name =>
  !name.trim() &&
  'Friends require a name.'

const notifyFriends = friends =>
  (friends.length > 3 && friends.every(friend => friend.name.trim())) &&
  'You sure are popular!'

const renderField = ({ field, control, ...props }) => {
  const showError = field.isInvalid && field.isTouched
  const inputClass = showError
    ? 'form-control border-danger'
    : 'form-control'
  return (
    <Fragment>
      <div className='form-group'>
        { props.label &&
          <label htmlFor={props.id}>{ props.label }</label>
        }
        { showError &&
          <div>
            <small className='text-danger'>{ field.error }</small>
          </div>
        }
        <input id={props.id} className={inputClass} {...control}/>
      </div>
      { field.hasNotice &&
        !field.isInvalid &&
        <div className='alert alert-success'>{ field.notice }</div>
      }
    </Fragment>
  )
}

const renderFriend = (friend, index, fields, key) =>
  <FieldSet name={index} key={key}>
    { _ =>
      <Field
        name='name'
        className={'form-control'}
        validate={validateFriendName}
        render={({ field, control }) => {
          const showError = field.isInvalid && field.isTouched
          const inputClass = showError
            ? 'form-control border-danger'
            : 'form-control'
          return (
            <Fragment>
              { showError &&
                <div>
                  <small className='text-danger'>{ field.error }</small>
                </div>
              }
              <div className='input-group form-group'>
                <input
                  type='text'
                  {...control}
                  placeholder='Name'
                  className={inputClass}/>
                <span className='input-group-btn'>
                  <button
                    type='button'
                    onClick={_ => fields.remove(index)}
                    className='btn btn-secondary'>
                    <i className='oi oi-x'/>
                  </button>
                </span>
              </div>
            </Fragment>
          )
        }}/>
    }
  </FieldSet>

const renderFriends = ({ fields }) =>
  <Fragment>
    <div className='form-group'>
      <legend><small>Friends ({ fields.length })</small></legend>
      { fields.map(renderFriend) }
      <button
        type='button'
        onClick={_ => fields.push({ name: '' })}
        className='btn btn-outline-success'>
        <i className='oi oi-plus'/>
      </button>
    </div>
    { fields.isInvalid &&
      fields.anyTouched &&
      !fields.isActive &&
      <div className='alert alert-danger'>{ fields.error }</div>
    }
    { fields.hasNotice &&
      <div className='alert alert-success'>{ fields.notice }</div>
    }
  </Fragment>

const renderContactInfo = _ =>
  <fieldset>
    <legend><small>Contact Info</small></legend>
    <label htmlFor='email'>Email</label>
    <Field
      id='email'
      name='email'
      type='email'
      render={renderField}
      validate={validateEmail}/>
  </fieldset>

render(
  <Form
    name='signUp'
    onSubmit={handleSubmit}
    render={({ form, control }) =>
      <form {...control} className='container'>
        <legend>Join Up!</legend>
        <Field
          id='username'
          name='username'
          label='Username'
          render={renderField}
          notify={notifyUsername}
          validate={validateUsername}/>
        <FieldSet
          name='contactInfo'
          className='form-group'
          render={renderContactInfo}/>
        <FieldArray
          name='friends'
          render={renderFriends}
          notify={notifyFriends}
          validate={validateFriends}/>
        <button type='reset' className='btn btn-outline-secondary'>
          Reset
        </button>
        { ' ' }
        <button type='submit' className='btn btn-primary'>
          Sign Up
        </button>
      </form>
    }/>,
  document.querySelector('#app')
)
