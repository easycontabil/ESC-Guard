import { HttpModuleOptions } from '@nestjs/common'

export default {
  /*
  |--------------------------------------------------------------------------
  | Http timeout
  |--------------------------------------------------------------------------
  |
  | Each request has a maximum time limit of five milliseconds
  |
  */
  timeout: 10000,

  /*
  |--------------------------------------------------------------------------
  | Max redirects
  |--------------------------------------------------------------------------
  |
  | The maximum of redirections that a request can do
  |
  */
  maxRedirects: 5,

  /*
  |--------------------------------------------------------------------------
  | Default services
  |--------------------------------------------------------------------------
  |
  | Default services token for communication.
  |
  */
  services: {},
} as HttpModuleOptions
