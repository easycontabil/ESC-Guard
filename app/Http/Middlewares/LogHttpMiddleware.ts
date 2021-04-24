import Log from 'start/debug'
import Chalk from 'start/chalk'

import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common'

@Injectable()
export class LogHttpMiddleware implements NestMiddleware {
  static get routes(): RouteMiddleware[] {
    return [{ path: '*', method: RequestMethod.ALL }]
  }

  use(req, res, next) {
    const url = req.url
    const method = req.method
    const rateLimit = req.rateLimit

    Log.httpMiddleware(`${Chalk.httpMethod(method)} ${Chalk.darkGreen(url)}`)
    Log.httpMiddleware({ rateLimit: rateLimit })

    next()
  }
}
