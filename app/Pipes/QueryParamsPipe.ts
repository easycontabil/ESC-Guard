import { ApiRequestContract } from '@secjs/core/contracts'
import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any): ApiRequestContract {
    const apiRequest: ApiRequestContract = {
      isInternRequest: false,
      where: {},
      orderBy: {},
      includes: [],
    }

    Object.keys(value).forEach(key => {
      const whereKey = key.split('*')[1]
      const orderByKey = key.split('-')[1]
      const includesKey = key.split('_')[1]

      if (whereKey && value[key]) {
        apiRequest.where[whereKey] = value[key]

        if (apiRequest.where[whereKey] === 'null')
          apiRequest.where[whereKey] = null

        return
      }

      if (orderByKey && value[key]) {
        apiRequest.orderBy[orderByKey] = (value[key] as 'ASC') || 'DESC'

        return
      }

      if (includesKey && value[key]) {
        apiRequest.includes[includesKey] = value[key]
      }
    })

    return apiRequest
  }
}
