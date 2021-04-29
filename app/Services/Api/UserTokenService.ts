import {
  CreateUserTokenDto,
  UpdateUserTokenDto,
} from 'app/Contracts/Dtos/UserDto'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ApiRequestContract } from '@secjs/core/contracts'
import { UserTokenRepository } from 'app/Repositories/UserTokenRepository'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'

@Injectable()
export class UserTokenService {
  @Inject(UserTokenRepository) private userTokenRepository: UserTokenRepository

  async findOne(id: string, options?: ApiRequestContract) {
    const model = await this.userTokenRepository.getOne(id, options)

    if (!model) {
      throw new NotFoundException('USER_TOKEN_NOT_FOUND')
    }

    return model
  }

  async findAll(pagination: PaginationContract, options?: ApiRequestContract) {
    return this.userTokenRepository.getAll(pagination, options)
  }

  async createOne(body: CreateUserTokenDto) {
    return this.userTokenRepository.storeOne(body)
  }

  async updateOne(id: string, body: UpdateUserTokenDto) {
    const model = await this.findOne(id)

    return this.userTokenRepository.update(model, body)
  }

  async createOrUpdate(body: CreateUserTokenDto) {
    const userToken = await this.findOne(null, {
      where: [{ key: 'userId', value: body.type }],
    })

    if (userToken) {
      userToken.token = body.token
      userToken.expiresIn = body.expiresIn
      userToken.isRevoked = body.isRevoked

      return this.updateOne(userToken.id, userToken)
    }

    return this.createOne(body)
  }
}
