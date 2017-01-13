const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

const isFunction = fn => typeof fn === 'function'

class Promise {
  constructor(resolver) {
    if (!isFunction(resolver)) {
      throw new TypeError(`Promise resolver ${resolver} is not a function`)
    }

    this._stauts = PENDING
    this._value = undefined

    this._subscribers = []    
  }
}
