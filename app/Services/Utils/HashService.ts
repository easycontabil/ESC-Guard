import { hash, compare } from 'bcryptjs'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashService {
  async generateHash(payload: string) {
    return hash(payload, 8)
  }

  async compareHash(payload: string, hashed: string) {
    return compare(payload, hashed)
  }
}
