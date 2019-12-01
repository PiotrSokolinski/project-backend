import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { Field, ObjectType, ID } from 'type-graphql'

import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

@Entity('messages')
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id?: number

  @CreateDateColumn()
  @Field()
  createdAt: Date

  @Column('varchar')
  @Field()
  text: string

  @ManyToOne(type => Group, group => group.messages)
  @JoinColumn()
  @Field(type => Group)
  group: Group

  @ManyToOne(type => User, sender => sender.messages, { eager: true })
  @JoinColumn()
  @Field(type => User)
  sender: User
}
