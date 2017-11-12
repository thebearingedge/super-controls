import field from '../field'
import controlled from '../controlled'

export default field(controlled('input'))({
  displayName: 'Input',
  defaultProps: { value: '' }
})
