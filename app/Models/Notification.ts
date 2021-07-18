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

@Entity('esc_notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column()
  title: string

  @Column()
  content: string

  @Column({
    enum: [
      'warn',
      'error',
      'success',
      'doubt',
      'answer',
      'doubtReaction',
      'answerReaction',
    ],
    default: 'warn',
  })
  type: string

  @Column({ enum: ['pendent', 'active'], default: 'pendent' })
  status: string

  @Column({ name: 'deleted_at', default: null })
  deletedAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(
    () => User,
    user => user.notifications,
  )
  @JoinColumn({ name: 'user_id' })
  user: User
}
