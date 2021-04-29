import {
  LoginValidator,
  ForgotPasswordValidator,
  ConfirmAccountValidator,
  ResetPasswordValidator,
} from 'app/Validators/AuthValidator'

import { ApiTags } from '@nestjs/swagger'
import { AuthService } from 'app/Services/Api/AuthService'
import { Controller, Post, Inject, Body } from '@nestjs/common'
import { CreateUserValidator } from 'app/Validators/UserValidator'
import { JoifulValidationPipe } from 'app/Pipes/JoifulValidationPipe'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject(AuthService) authService: AuthService

  @Post('login')
  async login(@Body(JoifulValidationPipe) body: LoginValidator) {
    return this.authService.login(body)
  }

  @Post('register')
  async register(@Body(JoifulValidationPipe) body: CreateUserValidator) {
    return this.authService.register(body)
  }

  @Post('forgot')
  async forgotPassword(
    @Body(JoifulValidationPipe) body: ForgotPasswordValidator,
  ) {
    return this.authService.forgotPassword(body)
  }

  @Post('confirm')
  async confirmAccount(
    @Body(JoifulValidationPipe) body: ConfirmAccountValidator,
  ) {
    return this.authService.confirmAccount(body)
  }

  @Post('reset')
  async resetPassword(
    @Body(JoifulValidationPipe) body: ResetPasswordValidator,
  ) {
    return this.authService.resetPassword(body)
  }
}
