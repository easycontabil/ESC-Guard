import * as Joi from '@hapi/joi'
import * as Joiful from 'joiful'

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotImplementedException,
  Optional,
  PipeTransform,
} from '@nestjs/common'

import { Constructor, getJoiSchema } from 'joiful/core'

type Mergeable = Constructor<any> | Joi.AnySchema

@Injectable()
export class JoifulValidationPipe implements PipeTransform {
  constructor(
    @Optional() private schemas?: Mergeable[],
    @Optional() private wrapSchemaAsArray?: boolean,
  ) {}

  mergeSchemas(): Joi.AnySchema {
    return this.schemas.reduce((merged: Joi.AnySchema, current) => {
      const schema =
        // eslint-disable-next-line no-prototype-builtins
        current.hasOwnProperty('isJoi') && current['isJoi']
          ? (current as Joi.AnySchema)
          : getJoiSchema(current as Constructor<any>, Joi)
      return merged ? merged.concat(schema) : schema
    }, undefined) as Joi.Schema
  }

  validateAsSchema(value: any) {
    const { error } =
      Array.isArray(value) && this.wrapSchemaAsArray
        ? Joi.array()
            .items(this.mergeSchemas())
            .validate(value, { abortEarly: false })
        : this.mergeSchemas().validate(value)

    if (error) throw new BadRequestException('Validation failed')
  }

  validateAsClass(value: any, metadata: ArgumentMetadata): void | never {
    const { error } = Array.isArray(value)
      ? Joiful.validateArrayAsClass(
          value,
          metadata.metatype as Constructor<any>,
          { abortEarly: false },
        )
      : Joiful.validateAsClass(value, metadata.metatype as Constructor<any>, {
          abortEarly: false,
        })

    if (error) {
      throw new BadRequestException(
        error.details.filter(detail => delete detail.context),
        'Validation Error',
      )
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata?.metatype && !this.schemas) {
      throw new NotImplementedException('Validation not found')
    }

    if (this.schemas) {
      this.validateAsSchema(value)
    } else {
      this.validateAsClass(value, metadata)
    }

    return value
  }
}
