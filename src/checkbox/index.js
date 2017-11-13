import createControl from '../create-control'

export default createControl('checkbox')({
  displayName: 'Checkbox',
  defaultProps: { checked: false }
})
