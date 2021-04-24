import Log from 'start/debug'

import { App } from 'test/Utils'
import { Connection } from 'mongoose'

export class Database {
  private app: App
  private connection: Connection

  constructor(app: App) {
    Log.test('Database test module started')

    this.app = app
    this.connection = this.getConnection()
  }

  getConnection() {
    return this.app.getInstance<Connection>('mainConnection')
  }

  getRepository<Repository>(repository: any) {
    return this.app.getInstance<Repository>(repository.name)
  }

  async closeConnection() {
    Log.test('Database connection closed')

    await this.connection.close(true)
  }

  async truncate() {
    const promises = []

    const collections = await this.connection.db.collections()

    collections.forEach(collection => {
      Log.test(`Truncating ${collection}`)

      promises.push(collection.deleteMany({}))
    })

    await Promise.all(promises)
  }

  async dropDatabase() {
    Log.test('Database dropped')

    await this.connection.db.dropDatabase()
  }

  async dropCollections(collections: string[]) {
    const promises = []

    collections.forEach(collection => {
      Log.test(`Dropping ${collection}`)

      promises.push(this.connection.collections[collection].drop())
    })

    await Promise.all(promises)
  }
}
