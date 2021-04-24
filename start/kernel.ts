import App from 'providers/ApplicationProvider'

import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { HttpModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/*
|--------------------------------------------------------------------------
| Kernel
|--------------------------------------------------------------------------
|
| Kernel is the imports from AppModule, all of the external modules that
| needs to be inside of NestJS IoC, will be exported in this Array.
|
*/

export default [
  ConfigModule.forRoot(App.configs),
  HttpModule.register(App.configs.http),
  TypeOrmModule.forFeature(App.models),
  TypeOrmModule.forRoot(App.configs.database.postgres),
  PassportModule.register(App.configs.app.authorization),
]
