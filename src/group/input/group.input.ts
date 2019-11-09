import { Field, InputType, ID, Int } from 'type-graphql'

@InputType()
export class inputGroup {
  // @Field(type => ID) readonly creatorId: number
  @Field() readonly name: string
  // @Field({ nullable: true }) readonly avatarUrl?: string
  @Field({ nullable: true }) readonly address?: string
  @Field(type => Int, { nullable: true }) readonly number?: number
  @Field({ nullable: true }) readonly zipCode?: string
  @Field({ nullable: true }) readonly city?: string
  @Field({ nullable: true }) readonly country?: string
}
