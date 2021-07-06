import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { writeFile } from 'fs'

import { User } from 'app/Models/User'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'
import { CreateUserDto } from 'app/Contracts/Dtos/UserDto'
import { UserService } from 'app/Services/Api/UserService'
import { HashService } from 'app/Services/Utils/HashService'
import { UserRepository } from 'app/Repositories/UserRepository'
import { UserTokenService } from 'app/Services/Api/UserTokenService'
import { Token } from '@secjs/core/utils/Classes/Token'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  @Inject(JwtService) private jwtService: JwtService
  @Inject(HashService) private hashService: HashService
  @Inject(UserService) private userService: UserService
  @Inject(ConfigService) private configService: ConfigService
  @Inject(MailerService) private mailerService: MailerService
  @Inject(UserRepository) private userRepository: UserRepository
  @Inject(UserTokenService) private userTokenService: UserTokenService

  async validateEmail(email: string) {
    const user = await this.userRepository.getOne(null, { where: { email } })

    if (user) throw new BadRequestException('EMAIL_ALREADY_TAKEN')
  }

  async generateToken(type: string, expiresIn: number, data: any) {
    const token = await this.jwtService.signAsync(data, {
      expiresIn,
    })

    if (data.id) {
      await this.userTokenService.createOrUpdate({
        type,
        token,
        userId: data.id,
        expiresIn: `${expiresIn * 1000}`,
      })
    }

    return {
      token,
      expiresIn,
    }
  }

  async verifyToken(token: string) {
    if (!token) {
      throw new BadRequestException('INVALID_TOKEN')
    }

    const split = token.split('Bearer ')[1]

    if (split) token = split

    return this.jwtService.verifyAsync(token)
  }

  async decodeToken(token: string) {
    const split = token.split('Bearer ')[1]

    if (split) token = split

    const payload = this.jwtService.decode(token)

    if (typeof payload === 'string' || !payload) {
      throw new BadRequestException('INVALID_TOKEN')
    }

    return payload
  }

  async refresh(user: User, token: string) {
    await this.decodeToken(token)

    await this.userTokenService.findOneAndVerifyExp(null, {
      where: { token, userId: user.id },
    })

    return {
      accessToken: await this.generateToken(
        'access_token',
        10800,
        user.toJSON(),
      ),
      refreshToken: await this.generateToken(
        'refresh_token',
        604800,
        user.toJSON(),
      ),
    }
  }

  async login({ email, password }) {
    email = email.trim()

    const user = await this.userService.findOne(null, { where: { email } })

    if (!(await this.hashService.compareHash(password, user.password))) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return {
      accessToken: await this.generateToken(
        'access_token',
        10800 * 108000,
        user.toJSON(),
      ),
      refreshToken: await this.generateToken('refresh_token', 604800, {
        ...user.toJSON(),
        isRefresh: true,
      }),
    }
  }

  async register(body: CreateUserDto) {
    if (body.image) {
      console.log('IMAGE RECEIVED: ', body.image)
      const imagesPath = `${this.configService.get('view.paths.images')}`
      const fileName = `${new Date().getTime()}-${
        body.name
      }-${new Token().generate()}.png`
      console.log(`IMAGES PATH: ${imagesPath}/${fileName}`)

      writeFile(`${imagesPath}/${fileName}`, body.image, err => {
        if (!err) throw new BadRequestException(err)
      })

      body.image = `${this.configService.get(
        'app.url',
      )}/${this.configService.get('view.paths.staticPath')}/${fileName}`
      console.log('IMAGE LINK RESULT: ', body.image)
    }

    body.email = body.email.trim()

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
    const user = await this.userService.findOne(null, { where: { email } })

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

    return {
      message: `Forgot password email sent to ${user.email}`,
    }
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
    await this.userService.updateOne(user, {
      password: await this.hashService.generateHash(password),
    })

    return {
      message: `User password ${user.name} successfully reset`,
    }
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
    await this.userService.updateOne(user, { status: 'active' })

    return {
      message: `User ${user.name} has been confirmed`,
    }
  }
}
