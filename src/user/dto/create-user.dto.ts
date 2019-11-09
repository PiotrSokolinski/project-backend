import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export class CreateUserDto {
  @Field(type => ID) readonly id?: number
  @Field() readonly email: string
  @Field() readonly password: string
  @Field() readonly firstName: string
  @Field() readonly lastName: string
  @Field({ nullable: true }) readonly avatarUrl?: string
  @Field({ nullable: true }) readonly owner?: boolean
  @Field({ nullable: true }) readonly token?: string
}
