import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { dbTokenPayload, dbUserPayload } from './constants'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenRepository } from 'app/Repositories/UserTokenRepository'

describe('\n[E2E] Auth Confirm', () => {
  it('should confirm the user account when has the token', async () => {
    const status = 201
    const path = '/auth/confirm'
    const user = await userRepository.storeOne(dbUserPayload)
    const token = await userTokenRepository.storeOne({
      userId: user.id,
      ...dbTokenPayload,
    })

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ token: token.token })
      .expect(status)

    const userUpdated = await userRepository.getOne(user.id)

    expect(userUpdated.status).toBe('active')
    expect(body.data.message).toBe(`User ${user.name} has been confirmed`)
  })

  it('should throw bad request error when token is expired', async () => {
    const status = 400
    const path = '/auth/confirm'
    const user = await userRepository.storeOne(dbUserPayload)
    const token = await userTokenRepository.storeOne({
      userId: user.id,
      ...dbTokenPayload,
    })
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2030, 4, 10, 12).getTime()
    })

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ token: token.token })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.message).toBe('TOKEN_EXPIRED')
    expect(body.error.message.error).toBe('Bad Request')
  })

  it('should throw not found error when token does not exists', async () => {
    const status = 404
    const path = '/auth/confirm'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ token: '1231231' })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_TOKEN_NOT_FOUND')
  })

  it('should throw not found error when token has been already revoked', async () => {
    const status = 404
    const path = '/auth/confirm'
    const user = await userRepository.storeOne(dbUserPayload)
    const token = await userTokenRepository.storeOne({
      userId: user.id,
      revokedAt: new Date(),
      ...dbTokenPayload,
    })

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ token: token.token })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.message).toBe('USER_TOKEN_NOT_FOUND')
    expect(body.error.message.error).toBe('Not Found')
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
