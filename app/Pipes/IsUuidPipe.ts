import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Token } from '@secjs/core/utils/Classes/Token'

@Injectable()
export class IsUuidPipe implements PipeTransform {
  transform(value: string) {
    const token = new Token()

    if (!token.verify(value)) {
      throw new BadRequestException('INVALID_UUID')
    }

    return value
  }
}
