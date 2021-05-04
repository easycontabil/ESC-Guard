import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { dbUserPayload } from './constants'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenRepository } from 'app/Repositories/UserTokenRepository'

describe('\n[E2E] Auth Forgot', () => {
  it('should send email to user email when forgot password', async () => {
    const status = 201
    const path = '/auth/forgot'
    const user = await userRepository.storeOne(dbUserPayload)

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ email: user.email })
      .expect(status)

    const forgotPasswordToken = await userTokenRepository.getOne(null, {
      where: { userId: user.id },
    })

    expect(forgotPasswordToken.id).toBeTruthy()
    expect(body.data.message).toBe(
      `Forgot password email sent to ${user.email}`,
    )
  })

  it('should throw not found error when user email does not exist', async () => {
    const status = 404
    const path = '/auth/forgot'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ email: 'any@email.com' })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_NOT_FOUND')
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
