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

  @Column()
  email: string

  @Column()
  password: string

  @Column({ enum: ['pendent', 'active'], default: 'pendent' })
  status: string

  @Column({ default: null })
  deletedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => UserToken,
    token => token.user,
  )
  tokens: UserToken[]
}
