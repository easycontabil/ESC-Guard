import {
  LoginValidator,
  ForgotPasswordValidator,
  ConfirmAccountValidator,
  ResetPasswordValidator,
  RefreshValidator,
} from 'app/Validators/AuthValidator'

import { User } from 'app/Decorators/Http/User'
import { JwtGuard } from 'app/Http/Guards/JwtGuard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthService } from 'app/Services/Api/AuthService'
import { CreateUserValidator } from 'app/Validators/UserValidator'
import { JoifulValidationPipe } from 'app/Pipes/JoifulValidationPipe'
import { Controller, Post, Inject, Body, UseGuards } from '@nestjs/common'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject(AuthService) authService: AuthService

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async refresh(
    @User() user,
    @Body(JoifulValidationPipe) body: RefreshValidator,
  ) {
    return this.authService.refresh(user, body.refreshToken)
  }

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
