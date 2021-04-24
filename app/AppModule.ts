import kernel from 'start/kernel'
import appProvider from 'providers/ApplicationProvider'

import { MiddlewareConsumer, Module } from '@nestjs/common'

@Module({
  imports: kernel,
  providers: appProvider.providers,
  controllers: appProvider.controllers,
  exports: appProvider.providers,
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    appProvider.middlewares.forEach(middleware => {
      consumer.apply(middleware.middleware).forRoutes(...middleware.routes)
    })
  }
}
