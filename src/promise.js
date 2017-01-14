const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

const isFunction = fn => typeof fn === 'function'
const noop = () => {}

const invokeCallback = (promise) => {}

class Promise {
  constructor(resolver) {
    if (!isFunction(resolver)) {
      throw new TypeError(`Promise resolver ${resolver} is not a function`)
    }

    this._stauts = PENDING
    this._value = undefined
    this._callbacks = []    
  }

  then(onFulfilled, onRejected) {
    const thenPromise = this.constructor(noop)

    this._callbacks = this._callbacks.concat([{
      onFulfilled: isFunction(onFulfilled) ? onFulfilled : null,
      onRejected: isFunction(onRejected) ? onRejected : null,
      thenPromise,
    }])

    invokeCallback(this)

    return thenPromise
  }
}
