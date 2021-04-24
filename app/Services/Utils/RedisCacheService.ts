import { Cache } from 'cache-manager'
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'
import { Ignore } from 'app/Decorators/Providers/Ignore'

@Ignore()
@Injectable()
export class RedisCacheService {
  @Inject(CACHE_MANAGER) private cache: Cache

  async get(key: string) {
    await this.cache.get(key)
  }

  async set(key: string, value: any) {
    await this.cache.set(key, value)
  }
}
