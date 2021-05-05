import 'start/env'
import Log from 'start/debug'
import * as request from 'supertest'

import { dbPayload } from './constants'
import { AppModule } from 'app/AppModule'
import { App, Database } from 'test/Utils'
import { AuthService } from 'app/Services/Api/AuthService'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'

describe('\n[E2E] User Index', () => {
  it('should list only the user logged in', async () => {
    const status = 200
    const path = '/users'
    const payload = await authService.decodeToken(tokens.accessToken.token)

    await userRepository.storeOne({
      ...dbPayload,
      email: 'lenonsec7@hotmail.com',
    })
    await userRepository.storeOne({
      ...dbPayload,
      email: 'jlenon7@hotmail.com',
    })

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${tokens.accessToken.token}`)
      .expect(status)

    expect(body.data).toHaveLength(1)
    expect(body.data[0].email).toBe(payload.email)
    expect(body.pagination.page).toBe(0)
    expect(body.pagination.total).toBe(1)
    expect(body.pagination.limit).toBe(10)
  })

  it('should list all users using admin', async () => {
    const status = 200
    const page = 0
    const limit = 2
    const path = `/users?page=${page}&limit=${limit}`

    await userRepository.storeOne({
      ...dbPayload,
      email: 'lenonsec7@hotmail.com',
    })
    await userRepository.storeOne({
      ...dbPayload,
      email: 'jlenon7@hotmail.com',
    })
    await userRepository.storeOne({
      ...dbPayload,
      deletedAt: new Date(),
      email: 'any@hotmail.com',
    })

    const user = await userRepository.storeOne({
      ...dbPayload,
      role: 'admin',
      email: 'lenonsec8@hotmail.com',
      password: await hashService.generateHash(dbPayload.password),
    })

    const { accessToken } = await authService.login({
      email: user.email,
      password: dbPayload.password,
    })

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${accessToken.token}`)
      .expect(status)

    expect(body.data).toHaveLength(limit)
    expect(body.pagination.page).toBe(page)
    expect(body.pagination.limit).toBe(limit)
    expect(body.pagination.total).toBe(4)
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
