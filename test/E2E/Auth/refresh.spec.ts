import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { dbUserPayload } from './constants'
import { AuthService } from 'app/Services/Api/AuthService'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'

describe('\n[E2E] Auth Refresh', () => {
  it('should refresh token and generate again', async () => {
    const status = 201
    const path = '/auth/refresh'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ refreshToken: tokens.refreshToken.token })
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.data.accessToken).toBeTruthy()
    expect(body.data.refreshToken).toBeTruthy()
  })

  it('should throw forbidden error when trying to authenticate with refresh token', async () => {
    const status = 403
    const path = '/auth/refresh'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ refreshToken: tokens.refreshToken.token })
      .set('Authorization', `Bearer ${tokens.refreshToken.token}`)
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Forbidden')
    expect(body.error.message.message).toBe('Forbidden resource')
  })

  it('should throw not found error when cant find user in guard', async () => {
    const status = 404
    const path = '/auth/refresh'

    const payload = await authService.decodeToken(tokens.accessToken.token)

    await userRepository.deleteOne(payload.id)

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ refreshToken: tokens.refreshToken.token })
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_NOT_FOUND')
  })

  it('should throw bad request error when refresh token is not valid', async () => {
    const status = 400
    const path = '/auth/refresh'

    const { body } = await request(app.server.getHttpServer())
      .post(path)
      .send({ refreshToken: '120391032901' })
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.error.name).toBe('Error')
    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Bad Request')
    expect(body.error.message.message).toBe('INVALID_TOKEN')
  })
})

let app: App
let database: Database
let hashService: HashService
let authService: AuthService
let userRepository: UserRepository

let tokens: {
  accessToken: { token: string; expiresIn: number }
  refreshToken: { token: string; expiresIn: number }
}

beforeEach(async () => {
  Log.test(`Executing ${beforeEach.name}`)

  app = await new App([AppModule]).initApp()
  database = new Database(app)

  await database.runMigrations()

  hashService = app.getInstance(HashService)
  authService = app.getInstance(AuthService)
  userRepository = database.getRepository(UserRepository)

  const user = await userRepository.storeOne({
    ...dbUserPayload,
    password: await hashService.generateHash(dbUserPayload.password),
  })

  tokens = await authService.login({
    email: user.email,
    password: dbUserPayload.password,
  })
})

afterEach(async () => {
  Log.test(`Executing ${afterEach.name}`)

  await database.dropDatabase()
  await app.closeApp()
})
