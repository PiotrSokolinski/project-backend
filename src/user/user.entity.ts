import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm'
import { GroupEntity } from '../group/group.entity'
import { TaskEntity } from '../task/task.entity'
import { EventEntity } from '../event/event.entity'

@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn() id: number

  @Column('varchar', { length: 50 })
  email: string

  @Column('varchar')
  hashedPassword: string

  @Column('varchar', { length: 50 })
  firstName: string

  @Column('varchar', { length: 50 })
  lastName: string

  @ManyToOne(type => GroupEntity, group => group.members)
  @JoinColumn()
  group: GroupEntity

  @OneToMany(type => TaskEntity, task => task.author)
  authorizedTasks: TaskEntity[]

  @OneToMany(type => EventEntity, event => event.author)
  authorizedEvents: EventEntity[]

  @OneToMany(type => TaskEntity, task => task.assignee)
  assignedTasks: TaskEntity[]

  @Column('varchar', { default: '' })
  avatarUrl: string

  @Column('boolean', { default: false })
  owner: boolean

  @Column('varchar')
  token: string

  @Column('varchar', { default: '' })
  nick: string

  @Column('varchar', { default: 'Administrator' })
  role: string

  @Column('varchar', { default: '#033dfc' })
  color: string
}
