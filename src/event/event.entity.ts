import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { GroupEntity } from '../group/group.entity'

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn() id: number

  @CreateDateColumn() createdAt: Date

  @Column('varchar', { length: 50 })
  name: string

  @Column('varchar')
  description: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @ManyToOne(type => UserEntity, author => author.authorizedEvents, {
    cascade: true,
  })
  @JoinColumn()
  author: UserEntity

  @ManyToOne(type => GroupEntity, group => group.tasks)
  group: GroupEntity

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  invitedMembers: UserEntity[]
}
