import Log from 'start/debug'

import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
  Logger,
  HttpException,
} from '@nestjs/common'

import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name)

  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const fullException = {
      name: exception.name,
      message: exception.getResponse
        ? exception.getResponse()
        : 'Internal Server Error',
      status: exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
      stack: exception.stack,
    }

    Log.httpException({ exception: fullException })

    let status = fullException.status
    let message = fullException.message
    const env = this.configService.get('app.environment')

    if (['development', 'production'].includes(env)) {
      this.logger.error({
        code: fullException.name,
        path: request.url,
        method: request.method,
        status: status,
        timestamp: new Date().toISOString(),
        error: fullException,
      })
    }

    if (env === 'production' && !exception.getResponse) {
      status = 500
      message = 'Internal Server Error'
    }

    return response.status(status).json({
      code: fullException.name,
      path: request.url,
      method: request.method,
      status: status,
      timestamp: new Date().toISOString(),
      error: {
        name: fullException.name,
        message: message,
      },
    })
  }
}
