import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import type { FastifyRequest } from 'fastify'
import type { Observable } from 'rxjs'
import { HttpStatus, Injectable } from '@nestjs/common'
import * as qs from 'qs'
import { map } from 'rxjs'
import { BYPASS_KEY } from '../decorators/bypass.decorator'
import { ResOp } from '../model/response.model'

/**
 * Decorator that unifies the handling of interface requests and responses
 * If you don't want to use it, you can use the `@Bypass()` decorator to bypass it
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const bypass = this.reflector.get(BYPASS_KEY, context.getHandler())

    if (bypass) {
      return next.handle()
    }

    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()

    request.query = qs.parse(request.url.split('?').at(1))

    return next.handle().pipe(
      map(data => new ResOp(HttpStatus.OK, data ?? null)),
    )
  }
}
