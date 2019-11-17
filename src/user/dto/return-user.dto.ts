import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export class ReturnUserDto {
  @Field(type => ID) readonly id?: number
  @Field() readonly email: string
  @Field() readonly firstName: string
  @Field() readonly lastName: string
  @Field() readonly nick: string
  @Field() readonly role: string
  @Field() readonly color: string
  @Field({ nullable: true }) readonly avatarUrl?: string
  @Field() readonly owner: boolean
  @Field({ nullable: true }) readonly token?: string
}
