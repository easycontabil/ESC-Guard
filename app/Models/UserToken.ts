import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { User } from 'app/Models/User'

@Entity('esc_user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
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

  @Column({ name: 'expires_in', nullable: true })
  expiresIn: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'revoked_at', default: null })
  revokedAt: Date

  @ManyToOne(
    () => User,
    user => user.tokens,
  )
  @JoinColumn({ name: 'user_id' })
  user: User
}
