import * as chalk from 'chalk'

class Chalk {
  get purple() {
    return chalk.hex('#7059C1')
  }

  get yellow() {
    return chalk.hex('#f18b0e')
  }

  get green() {
    return chalk.hex('#0ef12c')
  }

  get darkGreen() {
    return chalk.hex('#1cb70b')
  }

  get red() {
    return chalk.hex('#f10e0e')
  }

  get error() {
    return this.red().bold
  }

  get warning() {
    return this.yellow().bold
  }

  httpMethod(method: string) {
    return this[method]
  }

  get GET() {
    return this.purple.bold('GET 🔍')
  }

  get PUT() {
    return this.yellow.bold('PUT 🛠')
  }

  get POST() {
    return this.green.bold('POST 🧱')
  }

  get DELETE() {
    return this.red.bold('DELETE ❌')
  }
}

export default new Chalk()
