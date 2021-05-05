import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest()

    const id = request.params.id
    const user = request.user

    if (user.role === 'admin') {
      return true
    }

    if (user.id !== id) {
      throw new UnauthorizedException('USER_UNAUTHORIZED')
    }

    return true
  }
}
