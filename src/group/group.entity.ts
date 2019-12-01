import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Field, ObjectType, ID, Int } from 'type-graphql'

import { User } from '../user/user.entity'
import { Task } from '../task/task.entity'
import { Event } from '../event/event.entity'
import { Message } from '../message/message.entity'

@Entity('groups')
@ObjectType()
export class Group {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id?: number

  @Column('varchar', { length: 50 })
  @Field()
  name: string

  @OneToMany(type => Message, message => message.group /*, {
    cascade: true,
    eager: true,
  }*/)
  @Field(type => [Message])
  messages: Message[]

  @OneToMany(type => User, member => member.group, {
    cascade: true,
    eager: true,
  })
  @Field(type => [User])
  members: User[]

  @OneToMany(type => Task, task => task.group, {
    cascade: true,
  })
  @Field(type => [Task])
  tasks: Task[]

  @OneToMany(type => Event, event => event.group, {
    cascade: true,
  })
  @Field(type => [Event])
  events: Event[]

  @Column('varchar', { default: '' })
  @Field({ nullable: true })
  avatarUrl?: string

  @Column('varchar', { default: null })
  @Field({ nullable: true })
  address?: string

  @Column('numeric', { default: null })
  @Field(type => Int, { nullable: true })
  number?: number

  @Column('numeric', { default: null })
  @Field({ nullable: true })
  zipCode?: string

  @Column('varchar', { default: null })
  @Field({ nullable: true })
  city?: string

  @Column('varchar', { default: null })
  @Field({ nullable: true })
  country?: string
}
