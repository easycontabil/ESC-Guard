import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { storeUserPayload } from './constants'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenRepository } from 'app/Repositories/UserTokenRepository'

describe('\n[E2E] Auth Register', () => {
  it('should register an user', async () => {
    const status = 201
    const path = '/auth/register'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send(storeUserPayload)
      .expect(status)

    const confirmationToken = await userTokenRepository.getOne(null, {
      where: { userId: body.data.id, type: 'email_confirmation' },
    })

    expect(confirmationToken.id).toBeTruthy()
    expect(body.data.name).toBe(storeUserPayload.name)
  })

  it('should throw bad request error when user try to register with same email', async () => {
    const status = 400
    const path = '/auth/register'
    await userRepository.storeOne(storeUserPayload)

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send(storeUserPayload)
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Bad Request')
    expect(body.error.message.message).toBe('EMAIL_ALREADY_TAKEN')
  })
})

let app: App
let database: Database
let userRepository: UserRepository
let userTokenRepository: UserTokenRepository

beforeEach(async () => {
  Log.test(`Executing ${beforeEach.name}`)

  app = await new App([AppModule]).initApp()
  database = new Database(app)

  await database.runMigrations()

  userRepository = database.getRepository(UserRepository)
  userTokenRepository = database.getRepository(UserTokenRepository)
})

afterEach(async () => {
  Log.test(`Executing ${afterEach.name}`)

  await database.dropDatabase()
  await app.closeApp()
})
