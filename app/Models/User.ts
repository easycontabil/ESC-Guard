import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { UserToken } from 'app/Models/UserToken'

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

  @Column({ enum: ['accountant', 'customer', 'admin'], default: 'customer' })
  role: string

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
