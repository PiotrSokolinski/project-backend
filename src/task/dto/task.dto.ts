import { Field, ObjectType, ID } from 'type-graphql'
import { UserEntity } from '../../user/user.entity'
import { ReturnUserDto } from '../../user/dto/return-user.dto'

@ObjectType()
export class TaskDto {
  @Field(type => ID) readonly id?: number
  @Field() readonly createdAt: Date
  @Field() readonly name: string
  @Field() readonly description: string
  @Field() readonly status: string
  // @Field(type => UserEntity) readonly assignee: UserEntity
  // @Field(type => ReturnUserDto) readonly author: ReturnUserDto
  @Field() readonly priority: string
  // @Field() readonly tags: string[]
}
