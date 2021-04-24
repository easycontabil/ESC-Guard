import Log from 'start/debug'

import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AllExceptionFilter } from 'app/Http/Filters/AllExceptionFilter'
import { ResponseInterceptor } from 'app/Http/Interceptors/ResponseInterceptor'

export class App {
  private imports: any[]
  public server: INestApplication

  constructor(imports: any[]) {
    this.imports = imports
  }

  getInstance<Instance>(instance: any) {
    Log.test(`Calling ${instance} instance from Nest IoC`)

    return this.server.get<Instance>(instance)
  }

  async initApp() {
    const moduleRef = await Test.createTestingModule({
      imports: this.imports,
    }).compile()

    this.server = moduleRef.createNestApplication()

    const Config = this.getInstance<any>('ConfigService')
    this.server.useGlobalInterceptors(new ResponseInterceptor())
    this.server.useGlobalFilters(new AllExceptionFilter(Config))

    await this.server.init()

    Log.test('Nest test module started')

    return this
  }

  async closeApp() {
    Log.test('Nest test module closed')

    return this.server.close()
  }
}
