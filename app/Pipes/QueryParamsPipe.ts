import { ApiRequestContract } from '@secjs/core/contracts'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): ApiRequestContract {
    Object.keys(value).forEach(key => console.log(key))
    console.log(metadata)

    return {
      where: [],
      orderBy: [],
      includes: [],
    }
  }
}
