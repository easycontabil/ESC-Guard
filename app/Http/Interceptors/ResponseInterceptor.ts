import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const defaultResponses = {
      code: 'RESPONSE',
      path: request.url,
      method: request.method,
      status: context.switchToHttp().getResponse().statusCode,
    }

    return next.handle().pipe(
      map(data => ({
        ...defaultResponses,
        data,
      })),
    )
  }
}
