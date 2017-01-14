const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

const isFunction = fn => typeof fn === 'function'
const noop = () => {}


const nextTick = (fn) => setTimeout(fn, 0)

const resolve = (promise, value) => {}

const reject = (promise, value) => {}

const invokeCallback = (promise) => {
  if (promise._stauts === PENDING) {
    return
  }

  nextTick(() => {
    while (promise._callbacks.length) {
      
      const { 
        onFulfilled = (value => value), 
        onRejected = (value => { throw value }), 
        thenPromise,
      } = promise._callbacks.shift()

      let value

      try {
        value = (promise._stauts === FULFILLED ? onFulfilled : onRejected)(promise._value)
      } catch (e) {
        reject(thenPromise, e)
        continue
      }
      resolve(thenPromise, value)
    }
  })
}

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
      onFulfilled: isFunction(onFulfilled) ? onFulfilled : void 0,
      onRejected: isFunction(onRejected) ? onRejected : void 0,
      thenPromise,
    }])

    invokeCallback(this)

    return thenPromise
  }
}
