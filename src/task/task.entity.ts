import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Field, ObjectType, ID } from 'type-graphql'

import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

@Entity('tasks')
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn()
  @Field(type => ID, { nullable: true })
  id?: number

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  name: string

  @Column('varchar')
  @Field({ nullable: true })
  description: string

  @Column('varchar')
  @Field({ nullable: true })
  status: string

  @ManyToOne(type => User, assignee => assignee.authorizedTasks, {
    cascade: true,
  })
  @JoinColumn()
  @Field(type => User, { nullable: true })
  assignee: User

  @ManyToOne(type => User, author => author.assignedTasks, {
    cascade: true,
  })
  @JoinColumn()
  @Field(type => User, { nullable: true })
  author: User

  @ManyToOne(type => Group, group => group.tasks)
  @Field(type => Group, { nullable: true })
  group: Group

  @Column('varchar')
  @Field({ nullable: true })
  priority: string
}
