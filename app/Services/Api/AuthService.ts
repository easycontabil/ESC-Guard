import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'
import { CreateUserDto } from 'app/Contracts/Dtos/UserDto'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenService } from 'app/Services/Api/UserTokenService'

@Injectable()
export class AuthService {
  @Inject(JwtService) private jwtService: JwtService
  @Inject(HashService) private hashService: HashService
  @Inject(MailerService) private mailerService: MailerService
  @Inject(UserRepository) private userRepository: UserRepository
  @Inject(UserTokenService) private userTokenService: UserTokenService

  async validateEmail(email: string) {
    const user = await this.userRepository.getOne(null, {
      where: [{ key: 'email', value: email }],
    })

    if (user) throw new UnauthorizedException('EMAIL_ALREADY_TAKEN')
  }

  async login({ email, password }) {
    const user = await this.userRepository.findOne(null, {
      where: [{ key: 'email', value: email }],
    })

    if (await this.hashService.compareHash(password, user.password)) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    delete user.password

    const accessTokenExp = 10800
    const accessToken = await this.jwtService.signAsync(user, {
      expiresIn: accessTokenExp,
    })

    this.userTokenService.createOrUpdate({
      userId: user.id,
      token: accessToken,
      type: 'access_token',
      expiresIn: accessTokenExp.toString(),
    })

    const refreshTokenExp = 604800
    const refreshToken = await this.jwtService.signAsync(user, {
      expiresIn: refreshTokenExp,
    })

    this.userTokenService.createOrUpdate({
      userId: user.id,
      token: refreshToken,
      type: 'refresh_token',
      expiresIn: refreshTokenExp.toString(),
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
      expiresIn: '604800',
    })

    this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: confirmationToken.token,
      },
    })

    return user
  }

  async forgotPassword({ email }) {
    const user = await this.userRepository.getOne(null, {
      where: [{ key: 'email', value: email }],
    })

    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    const forgotPasswordToken = await this.userTokenService.createOne({
      userId: user.id,
      token: await this.hashService.generateHash(email),
      type: 'forgot_password',
      expiresIn: '604800',
    })

    this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: forgotPasswordToken.token,
      },
    })

    return user
  }

  async resetPassword({ token, password }) {
    const forgotPasswordToken = await this.userTokenService.findOne(null, {
      where: [{ key: 'token', value: token }],
    })

    const user = await this.userRepository.getOne(forgotPasswordToken.userId)

    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    await this.userTokenService.updateOne(forgotPasswordToken.id, {
      isRevoked: true,
      revokedAt: new Date(),
      status: 'revoked',
    })

    user.password = password

    return this.userRepository.save(user)
  }

  async confirmAccount({ token }) {
    const confirmationToken = await this.userTokenService.findOne(null, {
      where: [{ key: 'token', value: token }],
    })

    const user = await this.userRepository.getOne(confirmationToken.id)

    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    user.status = 'active'

    await this.userTokenService.updateOne(confirmationToken.id, {
      isRevoked: true,
      revokedAt: new Date(),
      status: 'revoked',
    })

    await this.userRepository.save(user)
  }
}
