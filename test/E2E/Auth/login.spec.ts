import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { dbUserPayload } from './constants'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenRepository } from 'app/Repositories/UserTokenRepository'

describe('\n[E2E] Auth Login', () => {
  it('should return access and refresh token for User', async () => {
    const status = 201
    const path = '/auth/login'
    const user = await userRepository.storeOne({
      ...dbUserPayload,
      password: await hashService.generateHash(dbUserPayload.password),
    })

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ email: user.email, password: dbUserPayload.password })
      .expect(status)

    const accessToken = await userTokenRepository.getOne(null, {
      where: { userId: user.id, type: 'access_token' },
    })

    const refreshToken = await userTokenRepository.getOne(null, {
      where: { userId: user.id, type: 'refresh_token' },
    })

    expect(accessToken.id).toBeTruthy()
    expect(refreshToken.id).toBeTruthy()
    expect(body.data.accessToken.token).toBe(accessToken.token)
    expect(body.data.refreshToken.token).toBe(refreshToken.token)
  })

  it('should throw not found error when user email does not exist', async () => {
    const status = 404
    const path = '/auth/login'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ email: 'any@email.com', password: '123' })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_NOT_FOUND')
  })

  it('should throw not found error when password does not match', async () => {
    const status = 404
    const path = '/auth/login'
    const user = await userRepository.storeOne({
      ...dbUserPayload,
      password: await hashService.generateHash(dbUserPayload.password),
    })

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ email: user.email, password: '123' })
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_NOT_FOUND')
  })

  it('should exists only one token of type refresh_token and access_token in database', async () => {
    const status = 201
    const path = '/auth/login'

    const user = await userRepository.storeOne({
      ...dbUserPayload,
      password: await hashService.generateHash(dbUserPayload.password),
    })

    await request(app.server.getHttpServer())
      .post(path)
      .send({ email: user.email, password: dbUserPayload.password })

    await request(app.server.getHttpServer())
      .post(path)
      .send({ email: user.email, password: dbUserPayload.password })
      .expect(status)

    const accessToken = await userTokenRepository.getAll(null, {
      where: { userId: user.id, type: 'access_token' },
    })

    const refreshToken = await userTokenRepository.getAll(null, {
      where: { userId: user.id, type: 'refresh_token' },
    })

    expect(accessToken.data).toHaveLength(1)
    expect(refreshToken.data).toHaveLength(1)
  })
})

let app: App
let database: Database
let hashService: HashService
let userRepository: UserRepository
let userTokenRepository: UserTokenRepository

beforeEach(async () => {
  Log.test(`Executing ${beforeEach.name}`)

  app = await new App([AppModule]).initApp()
  database = new Database(app)

  await database.runMigrations()

  hashService = app.getInstance(HashService)
  userRepository = database.getRepository(UserRepository)
  userTokenRepository = database.getRepository(UserTokenRepository)
})

afterEach(async () => {
  Log.test(`Executing ${afterEach.name}`)

  await database.dropDatabase()
  await app.closeApp()
})
