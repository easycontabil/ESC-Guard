import { User } from 'app/Models/User'
import { ApiRequestContract } from '@secjs/core/contracts'
import { UserRepository } from 'app/Repositories/UserRepository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from 'app/Contracts/Dtos/UserDto'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'
import { GuardBaseService } from '@secjs/core/base/Services/GuardBaseService'

@Injectable()
export class UserService extends GuardBaseService<User> {
  @Inject(UserRepository) private userRepository: UserRepository

  async findOne(id?: string | null, options?: ApiRequestContract) {
    options.where.deletedAt = null

    const model = await this.userRepository.getOne(id, options)

    if (!model) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return model
  }

  async findAll(pagination: PaginationContract, options?: ApiRequestContract) {
    options.where.deletedAt = null

    return this.userRepository.getAll(pagination, options)
  }

  async createOne(body: CreateUserDto) {
    return this.userRepository.storeOne(body)
  }

  async updateOne(id: string | User, body: UpdateUserDto) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return this.userRepository.updateOne(model, body)
  }

  async deleteOne(id: string | User) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return this.userRepository.deleteOne(model)
  }
}
