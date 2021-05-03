import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  CreateUserTokenDto,
  UpdateUserTokenDto,
} from 'app/Contracts/Dtos/UserDto'

import { UserToken } from 'app/Models/UserToken'
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

  async updateOne(id: string | UserToken, body: UpdateUserTokenDto) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return this.userTokenRepository.updateOne(model, body)
  }

  async createOrUpdate(body: CreateUserTokenDto) {
    const userToken = await this.userTokenRepository.getOne(null, {
      where: { type: body.type },
    })

    if (userToken) {
      return this.updateOne(userToken, {
        token: body.token,
        expiresIn: body.expiresIn,
        isRevoked: body.isRevoked,
      })
    }

    return this.createOne(body)
  }

  async findOneAndVerifyExp(id: string, options?: ApiRequestContract) {
    const model = await this.findOne(id, options)

    const dateNow = Date.now()
    const expiresIn = parseInt(model.expiresIn)
    const createdAt = model.createdAt.getTime()

    if (dateNow > expiresIn + createdAt) {
      throw new BadRequestException('TOKEN_EXPIRED')
    }

    return model
  }

  async revokeOne(id: string | UserToken) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return this.userTokenRepository.updateOne(model, { revokedAt: new Date() })
  }
}
