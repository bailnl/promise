const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

const isFunction = fn => typeof fn === 'function'
const isObject = obj => obj !== null && typeof obj === 'object'
const noop = () => {}


const nextTick = (fn) => setTimeout(fn, 0)

const resolve = (promise, x) => {
  if (promise === x) {

    reject(promise, new TypeError('You cannot resolve a promise with itself'))
  } else if (x && x.constructor === Promise) {
   
    if (x._stauts === PENDING) {
      const handler = statusHandler => value => statusHandler(promise, value)         
      x.then(handler(resolve), handler(reject))        
    } else if (x._stauts === FULFILLED) {
      fulfill(promise, x._value)
    } else if (x._stauts === REJECTED) {
      reject(promise, x._value)
    }
  } else if (isFunction(x) || isObject(x)) {

    let isCalled = false

    try {
      const then = x.then
      
      if (isFunction(then)) {

        const handler = statusHandler => value => {
            if (!isCalled) {
              statusHandler(promise, value)
            }
            isCalled = true
          }
        }
        then.call(promise, handler(reject), handler(fulfill))
      } else {
        fulfill(promise, x)
      }

    } catch (e) {
      if (!isCalled)  {
        reject(promise, e)
      }
    }

  } else {
    fulfill(promise, x)
  }
}

const reject = (promise, value) => {}
const fulfill = (promise, value) => {}

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
