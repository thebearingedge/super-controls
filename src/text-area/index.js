import createControl from '../create-control'

export default createControl('textarea')({
  displayName: 'TextArea',
  defaultProps: { value: '' }
})
