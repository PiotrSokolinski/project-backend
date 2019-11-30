import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Field, ObjectType, ID } from 'type-graphql'

import { Group } from '../group/group.entity'
import { Task } from '../task/task.entity'
import { Event } from '../event/event.entity'

@Entity('users')
@Index(['email'], { unique: true })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id?: number

  @Column('varchar', { length: 50 })
  @Field()
  email: string

  @Column('varchar')
  hashedPassword: string

  @Column('varchar', { length: 50 })
  @Field()
  firstName: string

  @Column('varchar', { length: 50 })
  @Field()
  lastName: string

  @ManyToOne(type => Group, group => group.members)
  @JoinColumn()
  @Field()
  group: Group

  @OneToMany(type => Task, task => task.author, { eager: true })
  @Field(type => [Task])
  authorizedTasks: Task[]

  @OneToMany(type => Event, event => event.author)
  @Field(type => [Event])
  authorizedEvents: Event[]

  @OneToMany(type => Task, task => task.assignee, { eager: true })
  @Field(type => [Task])
  assignedTasks: Task[]

  @Column('varchar', { default: '' })
  @Field({ nullable: true })
  avatarUrl?: string

  @Column('boolean', { default: false })
  @Field()
  owner: boolean

  @Column('varchar')
  @Field({ nullable: true })
  token?: string

  @Column('varchar', { default: '' })
  @Field()
  nick: string

  @Column('varchar', { default: 'Administrator' })
  @Field()
  role: string

  @Column('varchar', { default: '#033dfc' })
  @Field()
  color: string
}
