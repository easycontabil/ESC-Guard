import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  // RequestMethod,
} from '@nestjs/common'

import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'
import { isArrayOfObjects } from '@secjs/core/utils/Functions/isArrayOfObjects'

@Injectable()
export class QueryParamsMiddleware implements NestMiddleware {
  static get routes(): RouteMiddleware[] {
    return []
  }

  use(req, res, next) {
    try {
      let where = []
      let orderBy = []
      let includes = []

      if (req.query.where) {
        where = JSON.parse(req.query.where)

        if (!isArrayOfObjects(where))
          throw new BadRequestException('INVALID_WHERE_FORMAT')
      }

      if (req.query.orderBy) {
        orderBy = JSON.parse(req.query.orderBy)

        if (!isArrayOfObjects(orderBy))
          throw new BadRequestException('INVALID_ORDERBY_FORMAT')
      }

      if (req.query.includes) {
        includes = JSON.parse(req.query.includes)

        if (!isArrayOfObjects(includes))
          throw new BadRequestException('INVALID_INCLUDES_FORMAT')
      }

      req.query = {
        ...req.query,
        where,
        orderBy,
        includes,
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'INVALID_JSON_QUERY')
    }

    next()
  }
}
