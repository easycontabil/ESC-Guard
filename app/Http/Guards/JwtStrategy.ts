import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { UserService } from '../../Services/Api/UserService'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(UserService) private userService: UserService

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.authorization.jwt.secret'),
    })
  }

  async validate(payload: any) {
    return this.userService.findOne(payload.id)
  }
}
