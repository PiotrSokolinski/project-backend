import { Field, ObjectType, ID, Int } from 'type-graphql'
import { UserEntity } from '../../user/user.entity'

@ObjectType()
export class GroupDto {
  @Field(type => ID) readonly id?: number
  @Field() readonly name: string
  @Field({ nullable: true }) readonly avatarUrl?: string
  @Field({ nullable: true }) readonly address?: string
  @Field(type => Int, { nullable: true }) readonly number?: number
  @Field({ nullable: true }) readonly zipCode?: string
  @Field({ nullable: true }) readonly city?: string
  @Field({ nullable: true }) readonly country?: string
  // !!!!!!!!
  //@Field() readonly members: UserEntity[]
}
