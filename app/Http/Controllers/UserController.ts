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

import { User } from 'app/Decorators/Http/User'
import { IsUuidPipe } from 'app/Pipes/IsUuidPipe'
import { JwtGuard } from 'app/Http/Guards/JwtGuard'
import { UserService } from 'app/Services/Api/UserService'
import { ApiRequestContract } from '@secjs/core/contracts'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UpdateUserValidator } from 'app/Validators/UserValidator'
import { JoifulValidationPipe } from 'app/Pipes/JoifulValidationPipe'
import { PaginationContract } from '@secjs/core/contracts/PaginationContract'

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Inject(UserService) userService: UserService

  @Get()
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  async index(
    @User() user,
    @Pagination() pagination: PaginationContract,
    @Query(QueryParamsPipe) queries: ApiRequestContract,
  ) {
    return this.userService.setGuard(user).findAll(pagination, queries)
  }

  @Get(':id')
  async show(
    @User() user,
    @Param('id', IsUuidPipe) id: string,
    @Query(QueryParamsPipe) queries: ApiRequestContract,
  ) {
    return this.userService.setGuard(user).findOne(id, queries)
  }

  @Put(':id')
  async update(
    @User() user,
    @Param('id', IsUuidPipe) id: string,
    @Body(JoifulValidationPipe) body: UpdateUserValidator,
  ) {
    return this.userService.setGuard(user).updateOne(id, body)
  }

  @Delete(':id')
  async delete(@User() user, @Param('id', IsUuidPipe) id: string) {
    return this.userService.setGuard(user).deleteOne(id)
  }
}
