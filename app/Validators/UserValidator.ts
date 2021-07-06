import * as Joiful from 'joiful'
import { CreateUserDto, UpdateUserDto } from 'app/Contracts/Dtos/UserDto'

export class CreateUserValidator extends CreateUserDto {
  @(Joiful.string().required())
  name: string

  @(Joiful.string()
    .email()
    .required())
  email: string

  image?: Buffer | string

  @(Joiful.string().required())
  password: string

  @(Joiful.string().required())
  password_confirmation: string
}

export class UpdateUserValidator extends UpdateUserDto {
  @(Joiful.string().optional())
  name: string

  @(Joiful.string()
    .email()
    .optional())
  email: string

  @(Joiful.string().optional())
  password: string

  @(Joiful.string().optional())
  password_confirmation: string

  @(Joiful.date().optional())
  deletedAt: Date

  @(Joiful.string().optional())
  status: string
}
