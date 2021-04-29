import { User } from 'app/Models/User'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/core/base/Repositories/TypeOrmRepository'

@EntityRepository(User)
@Ignore({ onlyFromImports: true })
export class UserRepository extends TypeOrmRepository<User> {
  protected Model = new User()
}
