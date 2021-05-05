import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { dbPayload } from './constants'
import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { Token } from '@secjs/core/utils/Classes/Token'
import { AuthService } from 'app/Services/Api/AuthService'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'

describe('\n[E2E] User Show', () => {
  it('should show the user logged in', async () => {
    const status = 200
    const payload = await authService.decodeToken(tokens.accessToken.token)
    const path = `/users/${payload.id}`

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.data.email).toBe(payload.email)
  })

  it('should throw an unauthorized error when trying to see information from other user', async () => {
    const status = 401
    const path = `/users/${new Token().generate()}`

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Unauthorized')
    expect(body.error.message.message).toBe('USER_UNAUTHORIZED')
  })

  it('should throw not found error when user does not exist', async () => {
    const status = 404
    const payload = await authService.decodeToken(tokens.accessToken.token)
    const path = `/users/${payload.id}`

    await userRepository.deleteOne(payload.id)

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.error.message.statusCode).toBe(status)
    expect(body.error.message.error).toBe('Not Found')
    expect(body.error.message.message).toBe('USER_NOT_FOUND')
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
    ...dbPayload,
    password: await hashService.generateHash(dbPayload.password),
  })

  tokens = await authService.login({
    email: user.email,
    password: dbPayload.password,
  })
})

afterEach(async () => {
  Log.test(`Executing ${afterEach.name}`)

  await database.dropDatabase()
  await app.closeApp()
})
