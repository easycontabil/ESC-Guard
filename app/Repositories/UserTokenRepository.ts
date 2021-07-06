import { EntityRepository } from 'typeorm'
import { UserToken } from 'app/Models/UserToken'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/core/base/Repositories/TypeOrmRepository'

@EntityRepository(UserToken)
@Ignore({ onlyFromImports: true })
export class UserTokenRepository extends TypeOrmRepository<UserToken> {
  protected Model = UserToken.name
}
