import Log from 'start/debug'

import { App } from 'test/Utils'
import { Connection } from 'typeorm'

export class Database {
  private app: App
  private connection: Connection

  constructor(app: App) {
    Log.test('Database test module started')

    this.app = app
    this.connection = this.getConnection()
  }

  getConnection() {
    return this.app.getInstance<Connection>('Connection')
  }

  getRepository<Repository>(repository: any) {
    return this.app.getInstance<Repository>(repository.name)
  }

  async runMigrations() {
    await this.connection.runMigrations()

    Log.test('Migrations successfully up')
  }

  async undoMigrations() {
    await this.connection.undoLastMigration({ transaction: 'all' })

    Log.test('Migrations successfully down')
  }

  async closeConnection() {
    if (this.connection.isConnected) {
      await this.connection.close()

      Log.test('Database connection closed')
    }
  }

  async dropDatabase() {
    await this.undoMigrations()
    await this.connection.dropDatabase()

    Log.test('Database dropped')
  }
}
