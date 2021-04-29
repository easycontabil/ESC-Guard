import {
  Controller,
  Get,
  Put,
  Delete,
  Inject,
  UseGuards,
  Query,
  Param,
  Body,
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'
import { UserService } from 'app/Services/Api/UserService'
import { ApiRequestContract } from '@secjs/core/contracts'
import { JwtAuthGuard } from 'app/Http/Guards/JwtAuthGuard'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { CreateUserValidator } from 'app/Validators/UserValidator'
import { JoifulValidationPipe } from 'app/Pipes/JoifulValidationPipe'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Inject(UserService) userService: UserService

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(
    @Pagination() pagination: PaginationContract,
    @Query(QueryParamsPipe) queries: ApiRequestContract,
  ) {
    return this.userService.findAll(pagination, queries)
  }

  @Get(':id')
  async show(
    @Param('id') id: string,
    @Query(QueryParamsPipe) queries: ApiRequestContract,
  ) {
    return this.userService.findOne(id, queries)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(JoifulValidationPipe) body: CreateUserValidator,
  ) {
    return this.userService.updateOne(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteOne(id)
  }
}
