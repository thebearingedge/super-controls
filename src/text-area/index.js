import field from '../field'
import controlled from '../controlled'

export default field(controlled('textarea'))({
  displayName: 'TextArea',
  defaultProps: { value: '' }
})
