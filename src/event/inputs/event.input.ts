import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class inputEvent {
  @Field() readonly startDate: Date
  @Field() readonly endDate: Date
  @Field() readonly name: string
  @Field() readonly description: string
  @Field(type => ID) readonly invited: number[]
  @Field(type => ID) readonly group: number
}
