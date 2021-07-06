import { User } from 'app/Models/User'
import { Options } from 'app/Decorators/Services/Options'
import { ApiRequestContract } from '@secjs/core/contracts'
import { UserRepository } from 'app/Repositories/UserRepository'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from 'app/Contracts/Dtos/UserDto'
import { GuardBaseService } from '@secjs/core/base/Services/GuardBaseService'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'
import { Token } from '@secjs/core/utils/Classes/Token'
import { writeFile } from 'fs'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService extends GuardBaseService<User> {
  @Inject(ConfigService) private configService: ConfigService
  @Inject(UserRepository) private userRepository: UserRepository

  @Options()
  async findOneOrReturn(id?: string | User, options?: ApiRequestContract) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id, options)
    }

    return model as User
  }

  @Options()
  async findOne(id?: string | null, options?: ApiRequestContract) {
    if (!options) options.where = {}

    options.where.deletedAt = null

    const model = await this.userRepository.getOne(id, options)

    if (!model) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return model
  }

  @Options()
  async findAll(pagination: PaginationContract, options?: ApiRequestContract) {
    options.where.deletedAt = null

    if (this.guard.role !== 'admin') {
      options.where.id = this.guard.id
    }

    return this.userRepository.getAll(pagination, options)
  }

  async createOne(body: CreateUserDto) {
    return this.userRepository.storeOne(body)
  }

  async updateOne(id: string | User, body: UpdateUserDto) {
    const model = await this.findOneOrReturn(id)

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

    if (body.points) {
      body.points = model.points + body.points
    }

    return this.userRepository.updateOne(model, body)
  }

  async deleteOne(id: string | User) {
    const model = await this.findOneOrReturn(id)

    await this.userRepository.deleteOne(model)

    return {
      message: `User ${model.name} has been deleted`,
    }
  }
}
