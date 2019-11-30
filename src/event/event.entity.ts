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
import { Field, ObjectType, ID } from 'type-graphql'
import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

@Entity('events')
@ObjectType()
export class Event {
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

  @Column()
  @Field()
  startDate: Date

  @Column()
  @Field()
  endDate: Date

  @ManyToOne(type => User, author => author.authorizedEvents, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Field(type => User)
  author: User

  @ManyToOne(type => Group, group => group.tasks)
  @Field(type => Group)
  group: Group

  @ManyToMany(type => User, { cascade: true, eager: true })
  @JoinTable()
  @Field(type => [User])
  invitedMembers: User[]
}
