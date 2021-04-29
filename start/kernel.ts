import App from 'providers/ApplicationProvider'

import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { MailerModule } from '@nestjs-modules/mailer'

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
  MailerModule.forRoot(App.configs.mail),
  TypeOrmModule.forFeature(App.repositories),
  TypeOrmModule.forRoot(App.typeOrmConnection),
  JwtModule.register(App.configs.app.authorization.jwt),
  PassportModule.register(App.configs.app.authorization),
]
