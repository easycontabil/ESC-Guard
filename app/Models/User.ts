import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { UserToken } from './UserToken'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ enum: ['accountant', 'customer', 'admin'], default: 'customer' })
  role: string

  @Column({ enum: ['pendent', 'active'], default: 'pendent' })
  status: string

  @Column({ default: null })
  deletedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => UserToken,
    token => token.user,
  )
  tokens: UserToken[]

  toJSON() {
    const json = { ...this }

    Object.keys(json).forEach(key => {
      if (this.hidden.includes(key)) delete json[key]
    })

    return json
  }

  get hidden() {
    return ['password']
  }

  get includes() {
    return []
  }

  get where() {
    return [
      'id',
      'name',
      'email',
      'role',
      'status',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ]
  }
}
