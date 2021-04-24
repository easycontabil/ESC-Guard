import { RequestMethod } from '@nestjs/common'

export interface RouteMiddleware {
  path: string
  method: RequestMethod
}
