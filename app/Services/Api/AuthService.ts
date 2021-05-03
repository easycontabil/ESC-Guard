import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'
import { CreateUserDto } from 'app/Contracts/Dtos/UserDto'
import { UserService } from 'app/Services/Api/UserService'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenService } from 'app/Services/Api/UserTokenService'

@Injectable()
export class AuthService {
  @Inject(JwtService) private jwtService: JwtService
  @Inject(HashService) private hashService: HashService
  @Inject(UserService) private userService: UserService
  @Inject(MailerService) private mailerService: MailerService
  @Inject(UserRepository) private userRepository: UserRepository
  @Inject(UserTokenService) private userTokenService: UserTokenService

  async validateEmail(email: string) {
    const user = await this.userRepository.getOne(null, { where: { email } })

    if (user) throw new UnauthorizedException('EMAIL_ALREADY_TAKEN')
  }

  async login({ email, password }) {
    const user = await this.userService.findOne(null, { where: { email } })

    if (!(await this.hashService.compareHash(password, user.password))) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    const accessTokenExp = 10800
    const accessToken = await this.jwtService.signAsync(user.toJSON(), {
      expiresIn: accessTokenExp,
    })

    await this.userTokenService.createOrUpdate({
      userId: user.id,
      token: accessToken,
      type: 'access_token',
      expiresIn: `${accessTokenExp * 1000}`,
    })

    const refreshTokenExp = 604800
    const refreshToken = await this.jwtService.signAsync(user.toJSON(), {
      expiresIn: refreshTokenExp,
    })

    await this.userTokenService.createOrUpdate({
      userId: user.id,
      token: refreshToken,
      type: 'refresh_token',
      expiresIn: `${refreshTokenExp * 1000}`,
    })

    return { accessToken, refreshToken, accessTokenExp, refreshTokenExp }
  }

  async register(body: CreateUserDto) {
    await this.validateEmail(body.email)

    body.password = await this.hashService.generateHash(body.password)

    const user = await this.userRepository.storeOne(body)

    const confirmationToken = await this.userTokenService.createOne({
      userId: user.id,
      token: await this.hashService.generateHash(body.email),
      type: 'email_confirmation',
      expiresIn: `${604800 * 1000}`,
    })

    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: './email-confirmation',
      context: {
        token: confirmationToken.token,
      },
    })

    return user
  }

  async forgotPassword({ email }) {
    const user = await this.userRepository.getOne(null, { where: { email } })

    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    const forgotPasswordToken = await this.userTokenService.createOne({
      userId: user.id,
      token: await this.hashService.generateHash(email),
      type: 'forgot_password',
      expiresIn: `${604800 * 1000}`,
    })

    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: './recover-password',
      context: {
        token: forgotPasswordToken.token,
      },
    })

    return user
  }

  async resetPassword({ token, password }) {
    const forgotPasswordToken = await this.userTokenService.findOneAndVerifyExp(
      null,
      {
        where: { token, revokedAt: null },
      },
    )

    const user = await this.userService.findOne(forgotPasswordToken.userId)

    await this.userTokenService.revokeOne(forgotPasswordToken)

    return this.userService.updateOne(user, {
      password: await this.hashService.generateHash(password),
    })
  }

  async confirmAccount({ token }) {
    const confirmationToken = await this.userTokenService.findOneAndVerifyExp(
      null,
      {
        where: { token, revokedAt: null },
      },
    )

    const user = await this.userService.findOne(confirmationToken.userId)

    await this.userTokenService.revokeOne(confirmationToken)

    return this.userService.updateOne(user, { status: 'active' })
  }
}
