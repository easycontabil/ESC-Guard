import * as Joiful from 'joiful'
import { ApiProperty } from '@nestjs/swagger'

export class LoginValidator {
  @ApiProperty()
  @(Joiful.string()
    .email()
    .required())
  email: string

  @ApiProperty()
  @(Joiful.string().required())
  password: string
}

export class ForgotPasswordValidator {
  @ApiProperty()
  @(Joiful.string()
    .email()
    .required())
  email: string
}

export class ConfirmAccountValidator {
  @ApiProperty()
  @(Joiful.string().required())
  token: string
}

export class ResetPasswordValidator {
  @ApiProperty()
  @(Joiful.string().required())
  token: string

  @ApiProperty()
  @(Joiful.string().required())
  password: string
}
