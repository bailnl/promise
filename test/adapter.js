import Promise from '../src/promise'

export default {
  resolved(value) {
    return new Promise(resolve => resolve(value))
  },

  rejected(reason) {
    return new Promise((resolve, reject) => reject(reason))
  },

  deferred() {
    let resolve, reject
    return {
      promise: new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      }),
      resolve,
      reject,
    }
  }
}