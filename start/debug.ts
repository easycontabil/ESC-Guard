import { debug, Debugger } from 'debug'

class Log {
  private logMain: Debugger = debug('api:main')
  private logTest: Debugger = debug('api:test')
  private logEnvironment: Debugger = debug('api:environment')
  private logHttpException: Debugger = debug('api:http:exception')
  private logHttpMiddleware: Debugger = debug('api:http:middleware')

  main(message: any) {
    this.logMain(message)
  }

  test(message: any) {
    this.logTest(message)
  }

  environment(message: any) {
    this.logEnvironment(message)
  }

  httpException(message: any) {
    this.logHttpException(message)
  }

  httpMiddleware(message: any) {
    this.logHttpMiddleware(message)
  }
}

export default new Log()
