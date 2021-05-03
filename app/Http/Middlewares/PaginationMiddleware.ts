import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common'

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  static get routes(): RouteMiddleware[] {
    return [{ path: '/users', method: RequestMethod.GET }]
  }

  use(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 0
    const limit = req.query.limit ? parseInt(req.query.limit) : 10

    req.pagination = {
      page,
      limit,
    }

    next()
  }
}
