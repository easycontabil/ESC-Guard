import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  image?: Buffer | string

  @ApiProperty()
  password: string

  @ApiProperty()
  password_confirmation: string
}

export class UpdateUserDto {
  @ApiProperty()
  name?: string

  @ApiProperty()
  email?: string

  @ApiProperty()
  image?: string

  @ApiProperty()
  password?: string

  @ApiProperty()
  deletedAt?: Date

  @ApiProperty()
  status?: string
}

export class CreateUserTokenDto {
  token: string
  expiresIn: string
  type: string
  userId: string
  isRevoked?: boolean
  revokedAt?: Date
  status?: string
}

export class UpdateUserTokenDto {
  token?: string
  expiresIn?: string
  type?: string
  userId?: string
  isRevoked?: boolean
  revokedAt?: Date
  status?: string
}
