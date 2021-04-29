import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ApiRequestContract } from '@secjs/core/contracts'
import { UserRepository } from 'app/Repositories/UserRepository'
import { CreateUserDto, UpdateUserDto } from 'app/Contracts/Dtos/UserDto'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'

@Injectable()
export class UserService {
  @Inject(UserRepository) private userRepository: UserRepository

  async findOne(id: string, options?: ApiRequestContract) {
    const model = await this.userRepository.getOne(id, options)

    if (!model) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return model
  }

  async findAll(pagination: PaginationContract, options?: ApiRequestContract) {
    return this.userRepository.getAll(pagination, options)
  }

  async createOne(body: CreateUserDto) {
    return this.userRepository.storeOne(body)
  }

  async updateOne(id: string, body: UpdateUserDto) {
    const model = await this.findOne(id)

    return this.userRepository.update(model, body)
  }

  async deleteOne(id: string) {
    const model = await this.findOne(id)

    return this.userRepository.update(model, { deletedAt: new Date() })
  }
}
