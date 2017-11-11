import field from '../field'
import controlled from '../controlled'

export default Object.assign(field(controlled('hidden')), {
  displayName: 'Hidden'
})
