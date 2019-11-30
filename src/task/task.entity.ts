import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Field, ObjectType, ID } from 'type-graphql'

import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

@Entity('tasks')
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id?: number

  @CreateDateColumn()
  @Field()
  createdAt: Date

  @Column('varchar', { length: 50 })
  @Field()
  name: string

  @Column('varchar')
  @Field()
  description: string

  @Column('varchar')
  @Field()
  status: string

  @ManyToOne(type => User, assignee => assignee.authorizedTasks, {
    cascade: true,
  })
  @JoinColumn()
  @Field(type => User)
  assignee: User

  @ManyToOne(type => User, author => author.assignedTasks, {
    cascade: true,
  })
  @JoinColumn()
  @Field(type => User)
  author: User

  @ManyToOne(type => Group, group => group.tasks)
  @Field(type => Group)
  group: Group

  @Column('varchar')
  @Field()
  priority: string
}
