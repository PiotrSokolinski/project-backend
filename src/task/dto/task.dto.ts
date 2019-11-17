import { Field, ObjectType, ID } from 'type-graphql'
import { UserEntity } from '../../user/user.entity'

@ObjectType()
export class TaskDto {
  @Field(type => ID) readonly id?: string
  @Field() readonly createdAt: Date
  @Field() readonly name: string
  @Field() readonly description: string
  @Field() readonly status: string
  // @Field(type => UserEntity) readonly assignee: UserEntity
  // @Field(type => UserEntity) readonly author: UserEntity
  @Field() readonly priority: string
  // @Field() readonly tags: string[]
}
