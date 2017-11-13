import createControl from '../create-control'

export default createControl('text')({
  displayName: 'Text',
  defaultProps: { value: '' }
})
