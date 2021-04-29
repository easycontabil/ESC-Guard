import { ApiRequestContract } from '@secjs/core/contracts'
import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any): ApiRequestContract {
    const apiRequest: ApiRequestContract = {
      where: [],
      orderBy: [],
      includes: [],
    }

    Object.keys(value).forEach(key => {
      const whereKey = key.split('*')[1]
      const orderByKey = key.split('-')[1]
      const includesKey = key.split('_')[1]

      if (whereKey) {
        apiRequest.where.push({ key: whereKey, value: key[value] })

        return
      }

      if (orderByKey) {
        apiRequest.orderBy.push({
          key: orderByKey,
          ordenation: (key[value] as 'ASC') || 'DESC',
        })

        return
      }

      if (includesKey) {
        apiRequest.includes.push({ relation: includesKey })
      }
    })

    return apiRequest
  }
}
