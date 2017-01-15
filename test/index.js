import promisesAplusTests from 'promises-aplus-tests'
import Adapter  from './adapter'
import mocha from 'mocha'

describe('Promises/A+ Tests', () => {
  promisesAplusTests.mocha(Adapter)
})
