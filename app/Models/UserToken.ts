import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { User } from './User'

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  token: string

  @Column({
    enum: [
      'access_token',
      'refresh_token',
      'forgot_password',
      'email_confirmation',
    ],
  })
  type: string

  @Column({ enum: ['created', 'used'], default: 'created' })
  status: string

  @Column({ nullable: true })
  expiresIn: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true, default: null })
  revokedAt: Date

  @ManyToOne(
    () => User,
    user => user.tokens,
  )
  @JoinColumn({ name: 'userId' })
  user: User
}
