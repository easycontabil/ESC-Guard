import Env from '@secjs/env'
import { join } from 'path'

export default {
  /*
  |--------------------------------------------------------------------------
  | Postgres
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Postgres database.
  |
  | npm i --save pg
  |
  */
  postgres: {
    name: 'default',
    type: 'postgres',
    host: Env('DB_HOST', 'localhost'),
    port: Env('DB_PORT', '5432'),
    username: Env('DB_USERNAME', 'root'),
    password: Env('DB_PASSWORD', 'root'),
    database: Env('DB_DATABASE', 'test'),
    seeds: ['database/seeds/*{.ts,.js}'],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: 'database/migrations',
    },
    synchronize: Env({ name: 'DB_SYNCHRONIZE', type: 'boolean' }, false),
  },

  /*
  |--------------------------------------------------------------------------
  | Redis
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Redis database.
  |
  | npm i --save redis
  |
  */
  redis: {
    host: Env('REDIS_HOST', '127.0.0.1'),
    port: Env('REDIS_PORT', '6379'),
    ttl: 3600,
    password: Env('REDIS_PASSWORD', 'root'),
  },
}
