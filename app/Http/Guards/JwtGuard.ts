import { AuthGuard } from '@nestjs/passport'
import { AuthService } from 'app/Services/Api/AuthService'
import { ExecutionContext, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  @Inject(AuthService) private authService: AuthService

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest()

    const payload = await this.authService.decodeToken(
      request.headers.authorization,
    )

    if (payload.isRefresh) {
      return false
    }

    return super.canActivate(context)
  }
}
