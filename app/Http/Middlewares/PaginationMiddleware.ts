import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common'

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  static get routes(): RouteMiddleware[] {
    return [{ path: '/users', method: RequestMethod.GET }]
  }

  use(req, res, next) {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0
    const limit = req.query.limit ? parseInt(req.query.limit) : 10

    req.pagination = {
      skip,
      limit,
    }

    next()
  }
}
