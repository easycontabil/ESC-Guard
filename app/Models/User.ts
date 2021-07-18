import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { UserToken } from 'app/Models/UserToken'
import Env from '@secjs/env'
import { Notification } from './Notification'

@Entity('esc_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: 0 })
  points: number

  @Column({
    default: `${Env('APP_URL', 'http://127.0.0.1')}/grd/statics/default.png`,
  })
  image: string

  @Column({ enum: ['accountant', 'customer', 'admin'], default: 'customer' })
  role: string

  @Column({ default: 0 })
  nmrDuvidas: number

  @Column({ default: 0 })
  nmrRespostas: number

  @Column({ default: 0 })
  nmrResolucoes: number

  @Column({ enum: ['pendent', 'active'], default: 'pendent' })
  status: string

  @Column({ name: 'deleted_at', default: null })
  deletedAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(
    () => UserToken,
    token => token.user,
  )
  tokens: UserToken[]

  @OneToMany(
    () => Notification,
    notification => notification.user,
  )
  notifications: Notification[]

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
