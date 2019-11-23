import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { TaskEntity } from '../task/task.entity'
import { EventEntity } from '../event/event.entity'

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn() id: number

  @Column('varchar', { length: 50 })
  name: string

  @OneToMany(type => UserEntity, member => member.group, {
    cascade: true,
  })
  members: UserEntity[]

  @OneToMany(type => TaskEntity, task => task.group, {
    cascade: true,
  })
  tasks: TaskEntity[]

  @OneToMany(type => EventEntity, event => event.group, {
    cascade: true,
  })
  events: EventEntity[]

  @Column('varchar', { default: '' })
  avatarUrl: string

  @Column('varchar', { default: null })
  address: string

  @Column('numeric', { default: null })
  number: number

  @Column('numeric', { default: null })
  zipCode: string

  @Column('varchar', { default: null })
  city: string

  @Column('varchar', { default: null })
  country: string
}
