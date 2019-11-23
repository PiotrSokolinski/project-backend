import { Field, ObjectType, ID } from 'type-graphql'
import { UserEntity } from '../../user/user.entity'

@ObjectType()
export class EventDto {
  @Field(type => ID) readonly id?: number
  @Field() readonly createdAt: Date
  @Field() readonly startDate: Date
  @Field() readonly endDate: Date
  @Field() readonly name: string
  @Field() readonly description: string
  // @Field(type => UserEntity) readonly invited: UserEntity[]
  // @Field(type => UserEntity) readonly author: UserEntity
}
