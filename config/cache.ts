import * as redisStore from 'cache-manager-redis-store'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModuleAsyncOptions } from '@nestjs/common'

export default {
  /*
  |--------------------------------------------------------------------------
  | Redis cache configuration module
  |--------------------------------------------------------------------------
  |
  | Values used to export Redis Configuration to cache application.
  |
  */

  redis: {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      store: redisStore,
      ttl: 3600,
      host: configService.get('database.redis.host'),
      port: configService.get('database.redis.port'),
      password: configService.get('database.redis.password'),
    }),
  } as CacheModuleAsyncOptions,
}
